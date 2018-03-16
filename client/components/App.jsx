import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header';
import Subnav from './Subnav';
import Login from './Login';
// import Admin from './Admin';
import Dashboard from './Dashboard';
import Admin from './Admin';
// import Profile from './Profile';
// import Documents from './Documents';
// import Student from './Student';
// import Search from './Search';
// import Footer from './Footer';
// import Users from './Users';
import AuthContainer from './AuthContainer'; //
// import Types from './Types';
// import About from './About';
// import Contact from './Contact';
import Home from './Home';
// import Users from './Users';
// import Contracts from './Contracts';
// import Earnings from './Earnings';
import PasswordReset from './PasswordReset';
import BlackChip from './BlackChip';
import Intertoops from './Intertoops';
import ACR from './ACR';
import Betonline from './Betonline';
import NitrogenSports from './NitrogenSports';
import Blog from './Blog';
import Contact from './Contact';
import Faq from './Faq';
import ForgotPassword from './ForgotPassword';
import Login2 from './Login2';
import Register from './Register';
import Tos from './Tos';
import Single from './Single';

import SWC from './SWC';

const App = () => (
  <Router>
    <div>
      <Header />
      <Subnav />
      <div className="div-wrappper">
        <Switch>
          {/* <AuthContainer exact path="/" name="login" Comp={Login} /> */}
          <AuthContainer
            exact
            path="/reset-password"
            name="reset"
            Comp={PasswordReset}
          />
          <Route exact path="/" component={Home} />
          <Route exact path="/faq" component={Faq} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/blog" component={Blog} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/login" component={Login2} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/tos" component={Tos} />
          <Route exact path="/single" component={Single} />
          <Route exact path="/tools" component={Home} />
          <Route exact path="/sports" component={Home} />
          <Route exact path="/trading" component={Home} />
          <Route exact path="/blackchip-poker" component={BlackChip} />
          <Route exact path="/nitrogensports" component={NitrogenSports} />
          <Route exact path="/intertoops" component={Intertoops} />
          <Route exact path="/americas-cardroom" component={ACR} />
          <Route exact path="/betonline" component={Betonline} />
          <Route exact path="/swc" component={SWC} />
          {/* <Route exact path="/contact" component={Contact} /> */}
          <AuthContainer
            exact
            path="/dashboard"
            name="dashboard"
            Comp={Dashboard}
          />
          {/* <AuthContainer exact path="/types/" name="types" Comp={Types} /> */}
          <AuthContainer exact path="/admin" name="admin" Comp={Admin} />
          {/* <AuthContainer exact path="/users" name="admin" Comp={Users} /> */}
          {/* <AuthContainer
            exact
            path="/contracts"
            name="admin"
            Comp={Contracts}
          /> */}
          {/* <AuthContainer exact path="/profile" name="profile" Comp={Profile} /> */}
          {/* <AuthContainer exact path="/earnings" name="admin" Comp={Earnings} /> */}
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
