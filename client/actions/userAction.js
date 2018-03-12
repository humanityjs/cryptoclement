import axios from 'axios';
import processLogin from '../utils/processLogin';
import {
  GET_ALL_USERS,
  ADD_NEW_USER,
  ADD_SINGLE_USER,
  ADD_ERROR,
  REMOVE_ERROR,
  GET_USER_DETAILS
} from '../constants/actionType';

const addUsersToState = users => ({
  type: GET_ALL_USERS,
  users
});

const addNewUserToState = user => ({
  type: ADD_NEW_USER,
  user
});

const addSingleUserToState = user => ({
  type: GET_USER_DETAILS,
  user
});

const addErrorToState = error => ({
  type: ADD_ERROR,
  error
});

const removeErrors = () => ({
  type: REMOVE_ERROR
});

const initialState = {
  user: {
    contracts: []
  },
  contractSum: 0,
  earningsTotal: 0
};

/**
 * Get all users
 * @function getAllUser
 * @export
 * @returns {void}
 */
export function getAllUsers() {
  return dispatch =>
    axios.get('/api/users').then(
      ({ data }) => {
        dispatch(addUsersToState(data.users.rows));
      },
      ({ response }) => {
        console.log(response);
      }
    );
}

/**
 * Get all users
 * @function addNewUser
 * @param {object} userData
 * @export
 * @returns {void}
 */
export function addNewUser(userData) {
  return dispatch =>
    axios.post('/api/v1/users', userData).then(
      () => {
        dispatch(getAllUsers());
        return true;
      },
      ({ response }) => {
        console.log(response);
        return false;
      }
    );
}

/**
 * Get all users
 * @function addNewUser
 * @param {int} id
 * @export
 * @returns {void}
 */
export function getSingleUser(id) {
  return dispatch =>
    axios.get(`/api/contracts/user/${id}`).then(
      ({ data }) => {
        dispatch(addSingleUserToState(data));
        return true;
      },
      ({ response }) => {
        dispatch(addSingleUserToState(initialState));
        return false;
      }
    );
}

export function deleteStore() {
  return dispatch => dispatch(addSingleUserToState({}));
}

/**
 * Deletes a user
 * @export
 * @param {any} id
 * @return {void}
 */
export function deleteUser(id) {
  return dispatch =>
    axios
      .delete(`/api/v1/users/${id}`)
      .then(() => dispatch(getAllUsers()), ({ response }) => true);
}

/**
 * Removes errors from state
 * @export
 * @returns {void}
 */
export function deleteError() {
  return dispatch => dispatch(removeErrors());
}

export const editUser = (uuid, userData) => dispatch =>
  axios.put(`/api/users/${uuid}`, userData).then((response) => {
    processLogin(response.data.token, dispatch);
    return true;
  }, () => false);
