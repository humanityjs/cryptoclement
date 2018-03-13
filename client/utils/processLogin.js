import jwt from 'jsonwebtoken';
import setAuthorizationToken from './setAuthorizationToken';
import saveCurrentUser from '../actions/saveCurrentUser';
import config from '../../server/routes/config/config';

const processLogin = (token, dispatch) => {
  localStorage.setItem('jwtTokenBTCGrinders', token); //
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (decoded) {
      setAuthorizationToken(token);
      dispatch(saveCurrentUser(decoded));
    } else {
      setAuthorizationToken(null);
    }
  });
};

export default processLogin;
