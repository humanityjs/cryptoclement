import axios from 'axios';
import saveCurrentUser from '../actions/saveCurrentUser';
import setAuthorizationToken from '../utils/setAuthorizationToken';

const logoutAction = () => dispatch =>
  axios.post('/api/auth/logout').then(() => {
    localStorage.removeItem('jwtTokenBTCGrinders');
    setAuthorizationToken(false);
    dispatch(saveCurrentUser({}));
  });

export default logoutAction;
