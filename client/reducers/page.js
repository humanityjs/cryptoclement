import { SET_CURRENT_PAGE, SET_CURRENT_SUBPAGE } from '../constants/actionType';

const initialState = {
  currentPage: localStorage.getItem('currentPage') || 'poker',
  subPage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      localStorage.setItem('currentPage', action.currentPage);
      return {
        ...state,
        currentPage: action.currentPage,
      };
    case SET_CURRENT_SUBPAGE:
      return {
        ...state,
        subPage: action.subPage
      };
    default:
      return state;
  }
};
