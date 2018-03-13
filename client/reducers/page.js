import { SET_CURRENT_PAGE, SET_CURRENT_SUBPAGE } from '../constants/actionType';

const initialState = {
  currentPage: 'poker',
  subPage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return {
        currentPage: action.currentPage,
        subPage: state.subPage
      };
    case SET_CURRENT_SUBPAGE:
      return {
        currentPage: state.currentPage,
        subPage: action.subPage
      };
    default:
      return state;
  }
};
