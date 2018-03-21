import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import loginAction, { login2fa } from '../actions/loginAction';

class Subnav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      otp: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.loginOtp = this.loginOtp.bind(this);
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
      if (res.status && !res.tfa) {
        window.location.href = '/dashboard';
      } else if (res.status && res.tfa) {
        this.setState({
          stage2: true
        });
      } else {
        this.setState({
          error: 'Invalid login credentials'
        });
      }
    });
  }

  loginOtp(e) {
    e.preventDefault();
    this.setState({
      error: ''
    });
    const { otp, email } = this.state;
    if (!otp) {
      this.setState({
        error: 'Please enter otp'
      });
      return;
    }
    this.props.login2fa({ tfatoken: otp, email }).then((res) => {
      if (res) {
        window.location.href = '/dashboard';
      } else {
        this.setState({
          error: 'Invalid OTP. Please enter a valid one.'
        });
      }
    });
  }
  render() {
    const { user, isAuthenticated } = this.props.auth;
    const { currentPage, subPage } = this.props.pageInfo;
    return (
      <div>
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
                                  {!this.state.stage2 ? (
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
                                  ) : (
                                    <div>
                                        <p>Please generate an OTP code using google authenticate to continue</p>
                                        <div className="form-group">
                                          <label htmlFor="loginPassword">OTP</label>
                                          <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            name="otp"
                                            value={this.state.otp}
                                            onChange={this.onChange}
                                          />
                                        </div>
                                        <div className="text-center">
                                          <button className="cmn-btn" onClick={this.loginOtp}>Verify Token</button>
                                        </div>
                                      </div>
                                    )}
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
        {/* <% if (page !== 'dashboard' && page !== 'admin') { %> */}
        {subPage !== 'dashboard' && subPage !== 'admin' && (
          <section id="secondary-menu">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <ul className="nav">
                    <li className="nav-item">
                      <a className={subPage === 'blackchip-poker' ? 'nav-link active1' : 'nav-link'} href="/blackchip-poker">BlackChip</a>
                    </li>

                    <li className="nav-item">
                      <a className={subPage === 'americas-cardroom' ? 'nav-link active1' : 'nav-link'} href="/americas-cardroom">ACR</a>
                    </li>
                    <li className="nav-item">
                      <a className={subPage === 'swc' ? 'nav-link active1' : 'nav-link'} href="/swc">SWC</a>
                    </li>
                    <li className="nav-item">
                      <a className={subPage === 'betonline' ? 'nav-link active1' : 'nav-link'} href="/betonline">BetOnline</a>
                    </li>
                    <li className="nav-item">
                      <a className={subPage === 'intertoops' ? 'nav-link active1' : 'nav-link'} href="/intertoops">Intertops</a>
                    </li>
                    <li className="nav-item">
                      <a className={subPage === 'nitrogensports' ? 'nav-link active1' : 'nav-link'} href="/nitrogensports">Nitrogen</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* <% } %> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  pageInfo: state.pageInfo
});

export default connect(mapStateToProps, { loginAction, login2fa })(withRouter(Subnav));
