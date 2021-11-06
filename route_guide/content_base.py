import pandas as pd
import numpy as np
# tfidf
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.linear_model import Ridge
from sklearn import linear_model

class ContentBase:

  @staticmethod
  def getTfidf(x_train):
    transformer = TfidfTransformer(smooth_idf=True, norm='l2')
    tfidf = transformer.fit_transform(x_train.tolist()).toarray()
    return tfidf

  @staticmethod
  def get_items_rated_by_user(rate_matrix, user_id):
    y = rate_matrix[:, 0]
    ids = np.where(y == user_id)
    item_ids = rate_matrix[ids, 1];
    scores = rate_matrix[ids, 2]
    return item_ids, scores

  @staticmethod #Find the model for each user
  def GetRidgeRegression(self, n_users, rate_train, tfidf, W, b):
    for n in n_users:
      ids, scores = self.get_items_rated_by_user(rate_train, n[0])
      clf = Ridge(alpha=0.01, fit_intercept=True)
      Xhat = tfidf[ids, :]
      clf.fit(Xhat, scores)
      W[:, n] = clf.coef_
      b[0, n] = clf.intercept_
    return W, b
