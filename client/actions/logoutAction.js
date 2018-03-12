import axios from 'axios';
import saveCurrentUser from '../actions/saveCurrentUser';
import setAuthorizationToken from '../utils/setAuthorizationToken';

const logoutAction = () => dispatch =>
  axios.post('/auth/logout').then(() => {
    localStorage.removeItem('jwtTokenCrypto');
    setAuthorizationToken(false);
    dispatch(saveCurrentUser({}));
  });

export default logoutAction;
