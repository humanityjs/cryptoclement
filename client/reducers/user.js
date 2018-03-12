import { GET_USER_DETAILS, GET_ALL_USERS } from '../constants/actionType';

const initialState = {
  user: {
    contracts: []
  },
  contractSum: 0,
  earningsTotal: 0,
  users: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_DETAILS:
      return {
        ...state,
        ...action.user
      };
    case GET_ALL_USERS:
      return {
        ...state,
        users: [...action.users]
      };
    default:
      return state;
  }
};
