# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""The Python implementation of the gRPC route guide server."""
import urllib
from cgitb import text
from concurrent import futures

import content_base
from flask import Flask
from sqlalchemy import create_engine
import logging
import math
import time
import itertools
import numpy as np
from sqlalchemy import text
import pandas as pd
from sklearn.feature_extraction.text import TfidfTransformer
import grpc
from operator import itemgetter
import route_guide_pb2
import route_guide_pb2_grpc
import route_guide_resources
from content_base import ContentBase
from sklearn.linear_model import Ridge
from sklearn import linear_model

def get_feature(feature_db, point):
    """Returns Feature at given location or None."""
    for feature in feature_db:
        if feature.location == point:
            return feature
    return None

def get_distance(start, end):
    """Distance between two points."""
    coord_factor = 10000000.0
    lat_1 = start.latitude / coord_factor
    lat_2 = end.latitude / coord_factor
    lon_1 = start.longitude / coord_factor
    lon_2 = end.longitude / coord_factor
    lat_rad_1 = math.radians(lat_1)
    lat_rad_2 = math.radians(lat_2)
    delta_lat_rad = math.radians(lat_2 - lat_1)
    delta_lon_rad = math.radians(lon_2 - lon_1)

    # Formula is based on http://mathforum.org/library/drmath/view/51879.html
    a = (pow(math.sin(delta_lat_rad / 2), 2) +
         (math.cos(lat_rad_1) * math.cos(lat_rad_2) *
          pow(math.sin(delta_lon_rad / 2), 2)))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    R = 6371000
    # metres
    return R * c


class RouteGuideServicer(route_guide_pb2_grpc.RouteGuideServicer):
    """Provides methods that implement functionality of route guide server."""

    def __init__(self):
        self.db = route_guide_resources.read_route_guide_database()

    def GetFeature(self, request, context):
        feature = get_feature(self.db, request)
        if feature is None:
            return route_guide_pb2.Feature(name="", location=request)
        else:
            return feature

    def ListFeatures(self, request, context):
        left = min(request.lo.longitude, request.hi.longitude)
        right = max(request.lo.longitude, request.hi.longitude)
        top = max(request.lo.latitude, request.hi.latitude)
        bottom = min(request.lo.latitude, request.hi.latitude)
        for feature in self.db:
            if (feature.location.longitude >= left and
                    feature.location.longitude <= right and
                    feature.location.latitude >= bottom and
                    feature.location.latitude <= top):
                yield feature

    def RecordRoute(self, request_iterator, context):
        point_count = 0
        feature_count = 0
        distance = 0.0
        prev_point = None

        start_time = time.time()
        for point in request_iterator:
            point_count += 1
            if get_feature(self.db, point):
                feature_count += 1
            if prev_point:
                distance += get_distance(prev_point, point)
            prev_point = point

        elapsed_time = time.time() - start_time
        return route_guide_pb2.RouteSummary(point_count=point_count,
                                            feature_count=feature_count,
                                            distance=int(distance),
                                            elapsed_time=int(elapsed_time))

    def RouteChat(self, request_iterator, context):
        prev_notes = []
        for new_note in request_iterator:
            for prev_note in prev_notes:
                if prev_note.location == new_note.location:
                    yield prev_note
            prev_notes.append(new_note)

def getUserRatingMatrix(engine):
    print('engine type', type(engine))
    with engine.connect() as connection:
        result = connection.execute(text("select userId, jobId, rating from [dbo].[user_rating]"))
        test = [{column: value for column, value in rowproxy.items()} for rowproxy in result]
        df = pd.DataFrame(test)
        return df.values

def mapData(item, l_tags):
    i_map = list(map((lambda x:  0 if x['name'] not in item[1] else 1), l_tags))
    i_map.insert(1, item[0])
    return np.asarray(i_map)

def serve():
    app = Flask(__name__)

    engine = create_engine("mssql+pyodbc://root:admin@localhost:1433/CV_APP?driver=ODBC+Driver+17+for+SQL+Server")
    with engine.connect() as connection:
        result = connection.execute(text("SELECT jobs.id, tags.name  FROM dbo.jobs inner join job_tag on jobs.id = job_tag.jobId inner join tags on tags.id = job_tag.tagId"))
        # print('type',)
        test = [{column: value for column, value in rowproxy.items()} for rowproxy in result] #Return List of Dict
        res = {}
        for item in test:
          res.setdefault(item['id'], []).append(item['name'])
    with engine.connect() as connection:
        tag = connection.execute(text("SELECT id, name from tags"));
        l_tag = [{column: value for column, value in rowproxy.items()} for rowproxy in tag]
        data = list(res.items())
        a = np.asarray(list(map((lambda x:  mapData(x, l_tag)), data)))
        numberOfItem = len(l_tag)
        X_train_counts = a[:, -(numberOfItem-1):]

    with engine.connect() as connection:
        users = connection.execute(text("SELECT Id from users"))
        users = pd.DataFrame(users)

    # tfidf
    tfidf = ContentBase.getTfidf(X_train_counts)
    rate_train = getUserRatingMatrix(engine)
    ids, scores = ContentBase.get_items_rated_by_user(rate_train, '743164BE-CB6C-4E67-9EF8-CC80ED8CFE18')
    d = tfidf.shape[1]  # data dimension
    n_users = users.shape[0]
    W = np.zeros((d, n_users))
    b = np.zeros((1, n_users))
    W, b = ContentBase.GetRidgeRegression(self=ContentBase, n_users = np.asarray(users), rate_train = rate_train,  tfidf = tfidf, W = W, b =b)
    print('w', W)
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    route_guide_pb2_grpc.add_RouteGuideServicer_to_server(
        RouteGuideServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
