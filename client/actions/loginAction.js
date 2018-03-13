import axios from 'axios';
import processLogin from '../utils/processLogin';

const loginAction = userData => dispatch =>
  axios.post('/api/auth/login', userData).then((response) => {
    processLogin(response.data.token, dispatch);
    return true;
  }, () => false);

export default loginAction;
