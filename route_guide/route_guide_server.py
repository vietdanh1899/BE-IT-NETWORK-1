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
from cgitb import text
import asyncio
from sqlalchemy import create_engine
import logging
import numpy as np
from sqlalchemy import text
import pandas as pd
import grpc
from content_base import ContentBase
import rs_pb2
import rs_pb2_grpc
import urllib
import os
from dotenv import load_dotenv
from scipy import spatial
load_dotenv()

class RecommendationServicer(rs_pb2_grpc.RecommendationServicer):
    """Provides methods that implement functionality of route guide server."""
    def __init__(self):
        self.server = os.getenv('SERVER')
        self.username = os.getenv('USER_NAME')
        self.password = os.getenv('PASSWORD')
        self.port = os.getenv('PORT')
        self.database = os.getenv('DATABASE_NAME')
        print('server', self.server)
        print('user', self.username)
        print('password', self.password)
        print('port', self.port)
        print('database', self.database)

        yhat, users, data = InitDb(self)
        print('yhat', yhat)
        self.yhat = yhat
        self.users = users
        self.data = data

    def TrackChange(self, request, context):
        print('track change');
        try:
          yhat, users, data = InitDb(self)
          self.yhat = yhat
          self.users = users
          self.data = data
          return rs_pb2.Check(message='success')
        except:
          return rs_pb2.Check(message='failed')

    def GetItemRecommended(self, request, context):
        indexUserId = self.get_Index_user(request.id)
        print('req userId', request.id);
        print('index', indexUserId);
        print('req userId', request.id);
        print('yhat', self.yhat);
        itemIdsRated = self.yhat[:, indexUserId]
        print('item id rated', itemIdsRated)
        output = np.asarray([idx for idx, element in enumerate(itemIdsRated) if (element > 2.5)])
        print('output 1', output)

        if output.size == 0:
            # Get Most popular
            itemIds = self.GetMostPularItem()
            return rs_pb2.ItemResponse(itemIds=itemIds)
        else:
            # get rated item
            itemIds = self.data[output, 0]
            print('itemIdsRated', itemIdsRated)
            print('output', output)
            #return index of a sorted list
            indexItemSortedIds = sorted(range(len(itemIds)), key=lambda k: itemIds[k], reverse=True)
            print('item sorted', indexItemSortedIds)
            return rs_pb2.ItemResponse(itemIds=self.data[:,0][indexItemSortedIds]) #return sorted List ids of item by uuid

    def GetMostPularItem(self):
        sumArr = np.asarray(list(map((lambda  x: sum(x)), self.yhat)))
        # return index of a sorted list
        indexItemSortedIds = sorted(range(len(sumArr)), key=lambda k : sumArr[k], reverse=True)
        return self.data[:,0][indexItemSortedIds] #return sorted List ids of item by uuid

    def GetSimilarItem(self,  request, context):
        id = ContentBase.getIndexInArr(self.data[:,0], [request.id]);
        print('-->id', id)
        print('self data', self.yhat[id[0]])
        listItems = []
        for item in self.yhat:
            consi = 1 - spatial.distance.cosine(item,  self.yhat[id[0]])
            listItems.append(consi)

        indexItemSortedIds = sorted(range(len(listItems)), key=lambda k: listItems[k], reverse=True)
        # print('consi', indexItemSortedIds)
        return rs_pb2.ItemResponse(
            itemIds=self.data[:, 0][indexItemSortedIds[:10]])  # return sorted List ids of item by uuid
    def get_Index_user(self, userId):
        ids = np.where(self.users == userId)[0][0]
        return ids
def mapData(item, l_tags):
      i_map = list(map((lambda x:  0 if x['name'] not in item[1] else 1), l_tags))
      i_map.insert(0, item[0])
      return np.asarray(i_map)

def InitDb(self):
    params = urllib.parse.quote_plus("DRIVER=ODBC+Driver+17+for+SQL+Server;"
                                     "SERVER="+self.server+";"
                                     "DATABASE="+self.database+";"
                                     "UID="+self.username+";"
                                     "PWD="+self.password)
    engine = create_engine("mssql+pyodbc:///?odbc_connect={}".format(params))

    with engine.connect() as connection:
        result = connection.execute(text("SELECT jobs.id, tags.name  FROM dbo.jobs inner join job_tag on jobs.id = job_tag.jobId inner join tags on tags.id = job_tag.tagId"))
        test = [{column: value for column, value in rowproxy.items()} for rowproxy in result] #Return List of Dict
        res = {}
        for item in test:
          res.setdefault(item['id'], []).append(item['name'])
    with engine.connect() as connection:
      tag = connection.execute(text("SELECT id, name from tags"));
      l_tag = [{column: value for column, value in rowproxy.items()} for rowproxy in tag]
      data = list(res.items())
      a = np.asarray(list(map((lambda x: mapData(x, l_tag)), data)))
      numberOfItem = len(l_tag)
      X_train_counts = a[:, -(numberOfItem):]
      print('X_train_cont length', X_train_counts[0].size)
      print('X_train_counts', X_train_counts[0])
    with engine.connect() as connection:
      users = connection.execute(text("SELECT Id from users"))
      users = pd.DataFrame(users)

    # tfidf
    tfidf = ContentBase.getTfidf(X_train_counts)
    rate_train = getUserRatingMatrix(engine)

    d = tfidf.shape[1]  # data dimension
    n_users = users.shape[0]
    W = np.zeros((d, n_users))
    b = np.zeros((1, n_users))
    W, b = ContentBase.GetRidgeRegression(self=ContentBase, n_users=np.asarray(users), rate_train=rate_train,
                                          tfidf=tfidf, W=W, b=b, index_arr=a[:, 0])
    Yhat = tfidf.dot(W) + b
    with open('out.txt', 'w') as f:
        print('Filename:', Yhat, file=f)  # Python 3.x
    return Yhat, users, a
def getUserRatingMatrix(engine):
    with engine.connect() as connection:
        result = connection.execute(text("select userId, jobId, rating from [dbo].[user_rating]"))
        test = [{column: value for column, value in rowproxy.items()} for rowproxy in result]
        df = pd.DataFrame(test)
        return df.values

async def serve() -> None:
  server = grpc.aio.server()

  rs_pb2_grpc.add_RecommendationServicer_to_server(
    RecommendationServicer(), server)

  listen_addr = '[::]:50051'
  server.add_insecure_port(listen_addr)
  logging.info("Starting server on %s", listen_addr)
  await server.start()
  await server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    asyncio.run(serve())
