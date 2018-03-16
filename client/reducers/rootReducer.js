import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import page from './page';
import admin from './admin';

export default combineReducers({
  auth,
  user,
  pageInfo: page,
  admin
});
