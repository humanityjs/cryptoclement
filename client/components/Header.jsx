import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import logoutAction from '../actions/logoutAction';
import { saveCurrent, saveSub } from '../actions/pathActions';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.logOut = this.logOut.bind(this);
    const path = this.props.history.location.pathname;
    this.savePath(path);
    this.savePath = this.savePath.bind(this);
  }

  savePath(path) {

    if (
      path === '/tools' ||
      path === '/sports' ||
      path === '/poker' ||
      path === '/trading'
    ) {
      this.props.saveCurrent(path.replace('/', ''));
    } else if (path === '/') {
      this.props.saveCurrent('poker');
    } else {
      this.props.saveSub(path.replace('/', ''));
    }
  }

  /**
   * Logs a user out
   * @param {any} e
   * @returns {void}
   * @memberOf Dashboard
   */
  logOut(e) {
    e.preventDefault();
    this.props.logoutAction();
  }

  render() {
    const { user, isAuthenticated } = this.props.auth;
    return (
      <div>
        <section id="top">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="logo">
                  <a href="/">
                    <img src="images/BTC_Grinders_logo.png" height="auto" width="250" />
                  </a>
                </div>
                <div className="currency-icons">
                  <li>
                    <a href="">
                      <img src="images/icons/unnamed.png" height="35px" width="auto" />
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="images/icons/22.png" height="35px" width="auto" />
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="images/icons/55.png" height="35px" width="auto" />
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="images/icons/44.png" height="35px" width="auto" />
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="images/icons/bch1.png" height="35px" width="auto" />
                    </a>
                  </li>
                </div>
              </div>
              <div className="col-md-6">
                <div className="right-top  text-right">
                  <h4>
                    <font color="984E11">Exclusive Cryptocurrency Rewards!</font>
                  </h4>
                  {!isAuthenticated && (
                    <button className="cmn-btn" data-toggle="modal" data-target="#signup-modal">Create Account</button>
                  )}
                  {/* <!-- The Modal --> */}
                  <div className="modal fade" id="signup-modal">
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">

                        {/* <!-- Modal Header --> */}
                        <div className="modal-header">
                          <h4 className="modal-title">Register with Us</h4>
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>

                        {/* <!-- Modal body --> */}
                        <div className="modal-body">
                          <div className="text-center login-form">
                            <div className="error" id="errorDiv" />
                            <div className="success" id="successDiv" />
                            <form>
                              <div className="form-group">
                                <label htmlFor="email">Enter Your Email Address</label>
                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter Email and Password will be Sent" />
                              </div>
                              <div className="form-check">
                                <label className="form-check-label">
                                  <input className="form-check-input" id="tos" type="checkbox" />> I agree with the
                                  <a href="/tos">
                                    <u>Terms of Service</u>
                                  </a>.
                                </label>
                              </div>
                              <div className="text-center but-div">
                                <button id="registerBtn" className="cmn-btn">Create Account</button>
                              </div>
                            </form>

                            <div className="text-center">
                              <br />
                              <p>Already a Member?</p>
                              <div className="but-div">
                                <a href="/login">
                                  <button className="cmn-btn ">Login Now</button>
                                </a>
                              </div>
                              <br />
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

                  {/* <!-- End create accoint modal --> */}

                  <ul className="reg-menu">
                    {!isAuthenticated && (
                      <li>
                        <a href="/contact">
                          <font size="1">Contact Us</font>
                        </a>
                      </li>
                    )}
                    {!isAuthenticated && (
                      <li>
                        <a href="/forgot-pas">
                          <font size="1">Forgot Password?</font>
                        </a>
                      </li>
                    )}

                    {isAuthenticated && (
                      <li>
                        <a href="/dashboard">
                          <font size="1">Welcome, {user.email}
                          </font>
                        </a>
                      </li>
                    )}
                    {isAuthenticated && (
                      <li>
                        <a href="/logout" onClick={this.logOut}>
                          <font size="1">logout</font>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  pageInfo: state.pageInfo
});

export default connect(mapStateToProps, { logoutAction, saveCurrent, saveSub })(withRouter(Header));
