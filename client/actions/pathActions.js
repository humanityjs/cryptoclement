import { SET_CURRENT_PAGE, SET_CURRENT_SUBPAGE } from '../constants/actionType';

const saveCurrentAction = page => ({
  type: SET_CURRENT_PAGE,
  currentPage: page,
});

const saveSubAction = page => ({
  type: SET_CURRENT_SUBPAGE,
  subPage: page,
});

/**
 * Gets all types from the database
 * @export
 * @returns {void}
 */
export function saveCurrent(page) {
  return dispatch =>
    dispatch(saveCurrentAction(page));
}

/**
 * Add new document type to the database
 * @export
 * @param {any} data
 * @returns {void}
 */
export function saveSub(page) {
  return dispatch =>
    dispatch(saveSubAction(page));
}
