import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
// import Admin from './Admin';
import Dashboard from './Dashboard';
import Admin from './Admin';
import Profile from './Profile';
// import Documents from './Documents';
// import Student from './Student';
// import Search from './Search';
// import Footer from './Footer';
// import Users from './Users';
import AuthContainer from './AuthContainer'; //
// import Types from './Types';
// import About from './About';
// import Contact from './Contact';
import Users from './Users';
import Contracts from './Contracts';
import Earnings from './Earnings';
import PasswordReset from './PasswordReset';

const App = () => (
  <Router>
    <div>
      {/* <Header /> */}
      <div className="div-wrappper">
        <Switch>
          <AuthContainer exact path="/" name="login" Comp={Login} />
          <AuthContainer
            exact
            path="/reset-password"
            name="reset"
            Comp={PasswordReset}
          />
          {/* <Route exact path="/about" component={About} /> */}
          {/* <Route exact path="/contact" component={Contact} /> */}
          <AuthContainer
            exact
            path="/dashboard"
            name="dashboard"
            Comp={Dashboard}
          />
          {/* <AuthContainer exact path="/types/" name="types" Comp={Types} /> */}
          <AuthContainer exact path="/admin" name="admin" Comp={Admin} />
          <AuthContainer exact path="/users" name="admin" Comp={Users} />
          <AuthContainer
            exact
            path="/contracts"
            name="admin"
            Comp={Contracts}
          />
          <AuthContainer exact path="/profile" name="profile" Comp={Profile} />
          <AuthContainer exact path="/earnings" name="admin" Comp={Earnings} />
          {/* <AuthContainer
            exact
            path="/student/:id/"
            name="students"
            Comp={Student}
          /> */}
          {/* <AuthContainer
            eaxact
            path="/search/:q/"
            name="search"
            Comp={Search}
          /> */}
          {/* <AuthContainer exact path="/users/" name="users" Comp={Users} />
          <AuthContainer
            eaxct
            path="/documents/"
            name="documents"
            Comp={Documents}
          /> */}
        </Switch>
      </div>
      {/* <Footer /> */}
    </div>
  </Router>
);

export default App;
