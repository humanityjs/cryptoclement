import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import loginAction from '../actions/loginAction';

class Subnav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onLogin(e) {
    e.preventDefault();
    this.setState({
      error: ''
    });
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({
        error: 'Please fill all the fields'
      });
      return;
    }
    this.props.loginAction({ email, password }).then((res) => {
      if (res) {
        window.location.href = '/dashboard';
      }
      this.setState({
        error: 'Invalid login credentials'
      });
    });
  }
  render() {
    const { user, isAuthenticated } = this.props.auth;
    const { currentPage, subPage } = this.props.pageInfo;
    return (
      <section id="menu">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <ul className="nav">
                <li className="nav-item">
                  <a className={currentPage === 'poker' ? 'nav-link active1' : 'nav-link'} href="/">Poker</a>
                </li>

                <li className="nav-item">
                  <a className={currentPage === 'trading' ? 'nav-link active1' : 'nav-link'} href="/trading">Trading</a>
                </li>
                <li className="nav-item">
                  <a className={currentPage === 'sports' ? 'nav-link active1' : 'nav-link'} href="/sports">Sports</a>
                </li>
                <li className="nav-item">
                  <a className={currentPage === 'tools' ? 'nav-link active1' : 'nav-link'} href="/tools">Tools</a>
                </li>
              </ul>
            </div>
            <div className="col-md-2">
              <ul className="main-menu-socail">
                <li>
                  <a href="">
                    <i className="fa fa-facebook" />
                  </a>
                </li>
                <li>
                  <a href="">
                    <i className="fa fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="">
                    <i className="fa fa-youtube" />
                  </a>
                </li>
                <li>
                  <a href="">
                    <i className="fa fa-google-plus" />
                  </a>
                </li>
                <li>
                  <a href="">
                    <i className="fa fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-5">
              <ul className="main-menu-right nav">
                <li>
                  <a className={subPage === 'blog' ? 'nav-link active1' : 'nav-link'} href="/blog"><b>Blog</b></a>
                </li>
                <li>
                  <a className={subPage === 'faq' ? 'nav-link active1' : 'nav-link'} href="/faq"><b>Faq</b></a>
                </li>
                <li>
                  <a className="nav-link" href="">Affiliate</a>
                </li>
                {isAuthenticated ? subPage === 'dashboard' ? (
                  <li>
                    <a className="nav-link active1" href="/dashboard">Dashboard</a>
                  </li>
                ) : (
                  <li>
                      <a className="nav-link" href="/dashboard">Dashboard</a>
                    </li>
                  ) : (
                    <li>
                      <a data-toggle="modal" data-target="#login-modal" className="login-item"> Login </a>
                      <i className="fa fa-user" />
                      {/* <% } %> */}
                      {/* <!-- The Modal --> */}
                      <div className="modal fade" id="login-modal">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">

                            {/* <!-- Modal Header --> */}
                            <div className="modal-header">
                              <h4 className="modal-title">Log In</h4>
                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            {/* <!-- Modal body --> */}
                            <div className="modal-body">
                              <div className="text-left login-form">
                                {this.state.error && <span>{this.state.error}</span>}
                                <form action="" method="">
                                  <div className="form-group">
                                    <label htmlFor="loginEmail">Email address</label>
                                    <input
                                      type="loginEmail"
                                      className="form-control"
                                      id="loginEmail"
                                      aria-describedby="loginEmail"
                                      placeholder="Enter email"
                                      name="email"
                                      value={this.state.email}
                                      onChange={this.onChange}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="loginPassword">Password</label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      id="loginPassword"
                                      placeholder="Password"
                                      name="password"
                                      value={this.state.password}
                                      onChange={this.onChange}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <button id="loginBtn" className="cmn-btn" onClick={this.onLogin}>Login</button>
                                  </div>
                                </form>
                                <ul className="reg-menu text-center">
                                  <li>
                                    <a href="/contact">Contact Us</a>
                                  </li>
                                  <li>
                                    <a href="/tos">Help</a>
                                  </li>
                                  <li>
                                    <a href="/forgot-pas">Forgot Password?</a>
                                  </li>
                                </ul>
                                <p className="text-center">New User?</p>
                                <div className="text-center but-div">

                                  <a href="/register">
                                    <button className="cmn-btn">Register Now</button>
                                  </a>
                                </div>

                              </div>
                            </div>

                            {/* <!-- Modal footer --> */}
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>

                          </div>
                        </div>
                      </div>

                    </li>
                  )}
                {/* <% if (user && user.role === 1 && page === 'admin') { %> */}
                {isAuthenticated && user.roleId === 1 ? subPage === 'admin' ? (
                  <li>
                    <a className="nav-link active1" href="/admin">Admin</a>
                  </li>
                ) : (
                  <li>
                      <a className="nav-link" href="/admin">Admin</a>
                    </li>
                  ) : ('')}
              </ul>

            </div>

          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  pageInfo: state.pageInfo
});

export default connect(mapStateToProps, { loginAction })(withRouter(Subnav));
