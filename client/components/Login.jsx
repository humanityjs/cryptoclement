import React, { Component } from 'react'; //
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import loginAction from '../actions/loginAction';

/**
 * Login component
 * @class Login
 * @extends {Component}
 */
class Login extends Component {
  /**
   * Creates an instance of Login.
   * @param {any} props
   * @memberOf Login
   */
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
      error: '',
      login: true,
      forgotPassword: false,
      register: false,
      errors: {},
      lname: '',
      fname: '',
      streetAddress: '',
      btcAddress: '',
      email: '',
      username: '',
      passwordConfirmation: '',
      success: '',
      roleId: 2
    };
    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onUserSubmit = this.onUserSubmit.bind(this);
    this.resetMode = this.resetMode.bind(this);
    this.loginMode = this.loginMode.bind(this);
    this.createMode = this.createMode.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  /**
   * Handles form change
   * @param {any} e
   * @returns {void}
   * @memberOf Login
   */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: ''
    });
  }

  /**
   * Add new users
   * @method onUserSubmit
   * @returns {void}
   * @memberOf Admin
   */
  onUserSubmit() {
    const {
      passwordConfirmation,
      password,
      email,
      username,
      fname,
      lname,
      streetAddress,
      btcAddress
    } = this.state;
    this.setState({
      error: '',
      errors: {}
    });
    if (
      !password ||
      !email ||
      !username ||
      !fname ||
      !lname ||
      !streetAddress ||
      !btcAddress
    ) {
      this.setState({
        error: 'Please fill all fields'
      });
    } else if (password !== passwordConfirmation) {
      this.setState({
        error: 'Password does not match'
      });
    } else {
      this.setState({
        errors: {}
      });
      axios.post('/api/users', this.state).then(
        () => {
          this.setState({
            register: false,
            login: true,
            error: '',
            success: 'Account created successfully. Please login.'
          });
        },
        ({ response }) => {
          if (response.data.errors) {
            this.setState({
              errors: response.data.errors
            });
          } else {
            this.setState({
              error: response.data.message
            });
          }
        }
      );
    }
  }

  createMode() {
    this.setState({
      login: false,
      forgotPassword: false,
      register: true,
      success: '',
      error: ''
    });
  }

  resetMode() {
    this.setState({
      login: false,
      register: false,
      forgotPassword: true,
      success: '',
      error: ''
    });
  }

  loginMode() {
    this.setState({
      register: false,
      forgotPassword: false,
      login: true,
      success: '',
      error: ''
    });
  }

  /**
   * Submit the form
   * @param {any} e
   * @returns {void}
   * @memberOf Login
   */
  submitForm(e) {
    e.preventDefault();
    this.setState({
      error: ''
    });
    const { identifier, password } = this.state;
    if (identifier !== '' && password !== '') {
      this.props.loginAction(this.state).then((res) => {
        if (!res) {
          this.setState({
            error: 'Invalid credentials!'
          });
        }
      });
    }
  }

  resetPassword() {
    const email= this.state.email.toLowerCase();
    const filter = /^[\w\-.+]+@[a-zA-Z0-9.-]+\.[a-zA-z0-9]{2,4}$/;
    this.setState({
      error: ''
    });
    if (!email || filter.test(email) === false) {
      this.setState({
        error: 'Please enter a valid email'
      });
    } else {
      axios.post('/api/users/reset/init', { email }).then(
        () => {
          this.setState({
            success: 'Please check your email to continue.'
          });
        },
        () => {
          this.setState({
            error: "Sorry, we couldn't find any user with that email."
          });
        }
      );
    }
  }

  /**
   * Renders the component
   * @method render
   * @returns {void}
   * @memberOf Login
   */
  render() {
    const {
      error,
      errors,
      identifier,
      password,
      login,
      register,
      forgotPassword,
      success
    } = this.state;
    return (
      <div>
        <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">
          <nav
            className="uk-navbar-container"
            uk-navbar={true.toString()}
            style={{ position: 'relative', zIndex: 980 }}
          >
            <div className="uk-navbar-left">
              <a className="uk-navbar-item uk-logo" href="#">
                <img src="/imgs/cryto-logo.png" alt="logo" />
              </a>
            </div>
          </nav>
        </div>
        <div
          className="uk-background-blend-overlay uk-background-primary uk-background-cover bg-height uk-panel uk-flex uk-flex-center uk-flex-middle"
          style={{ backgroundImage: 'url(/imgs/header_bg.jpg)' }}
        >
          <div className="">
            <div
              className="uk-child-width-1-2@s uk-child-width-1-2@m uk-child-width-1-3@l uk-text-center uk-flex-center uk-flex-middle"
              uk-grid={true.toString()}
            >
              {/* Login Component */}
              {login && (
                <div className="p30 login-card">
                  <div className="uk-card uk-card-large uk-card-body">
                    <img src="/imgs/user.png" alt="user-logo" />
                    {error && (
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <div
                            className="uk-alert-danger"
                            uk-alert={true.toString()}
                          >
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {success && (
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <div
                            className="uk-alert-success"
                            uk-alert={true.toString()}
                          >
                            <p>{success}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="identifier"
                          value={identifier}
                          onChange={this.onChange}
                          className="uk-input"
                          type="text"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: lock" />
                        <input
                          name="password"
                          value={password}
                          onChange={this.onChange}
                          className="uk-input"
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <button
                          className="uk-button uk-button-primary btn-border"
                          onClick={this.submitForm}
                        >
                          Login
                        </button>
                      </div>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <a href="#" onClick={this.resetMode}>
                          Reset Password
                        </a>{' '}
                        |{' '}
                        <a href="#" onClick={this.createMode}>
                          Create new Account
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Register Component */}
              {register && (
                <div className="p30 login-card">
                  <div className="uk-card uk-card-large uk-card-body">
                    <img src="/imgs/user.png" alt="user-logo" />
                    {error && (
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <div
                            className="uk-alert-danger"
                            uk-alert={true.toString()}
                          >
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="fname"
                          value={this.state.fname}
                          onChange={this.onChange}
                          className="uk-input"
                          type="text"
                          placeholder="First Name"
                        />
                      </div>
                      <span>{errors.fname && errors.fname}</span>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="lname"
                          value={this.state.lname}
                          onChange={this.onChange}
                          className="uk-input"
                          type="text"
                          placeholder="Last Name"
                        />
                      </div>
                      <span>{errors.lname && errors.lname}</span>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="email"
                          value={this.state.email}
                          onChange={this.onChange}
                          className="uk-input"
                          type="text"
                          placeholder="Email"
                        />
                      </div>
                      <span>{errors.email && errors.email}</span>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="streetAddress"
                          value={this.state.streetAddress}
                          onChange={this.onChange}
                          className="uk-input"
                          type="text"
                          placeholder="Street Address"
                        />
                      </div>
                      <span>
                        {errors.streetAddress && errors.streetAddress}
                      </span>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="btcAddress"
                          value={this.state.btcAddress}
                          onChange={this.onChange}
                          className="uk-input"
                          type="text"
                          placeholder="Bitcoin Address"
                        />
                      </div>
                      {errors.btcAddress && errors.btcAddress}
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="username"
                          value={this.state.username}
                          onChange={this.onChange}
                          className="uk-input"
                          type="text"
                          placeholder="Username"
                        />
                      </div>
                      <span>{errors.username && errors.username}</span>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="password"
                          value={this.state.password}
                          onChange={this.onChange}
                          className="uk-input"
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                      <span>{errors.password && errors.password}</span>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <span className="uk-form-icon" uk-icon="icon: user" />
                        <input
                          name="passwordConfirmation"
                          value={this.state.passwordConfirmation}
                          onChange={this.onChange}
                          className="uk-input"
                          type="password"
                          placeholder="Confirm password"
                        />
                      </div>
                      <span>
                        {errors.passwordConfirmation &&
                          errors.passwordConfirmation}
                      </span>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <button
                          className="uk-button uk-button-primary btn-border"
                          onClick={this.onUserSubmit}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <a href="#" onClick={this.loginMode}>
                          Login
                        </a>{' '}
                        |{' '}
                        <a href="#" onClick={this.resetMode}>
                          Reset Password
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* forgot password component */}

              {forgotPassword && (
                <div className="p30 login-card">
                  <div className="uk-card uk-card-large uk-card-body">
                    <img src="/imgs/user.png" alt="user-logo" />
                    {error && (
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <div
                            className="uk-alert-danger"
                            uk-alert={true.toString()}
                          >
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {success && (
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <div
                            className="uk-alert-success"
                            uk-alert={true.toString()}
                          >
                            <p>{success}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {!success && (
                      <div className="mt-20">
                        <div className="uk-margin">
                          <div className="uk-inline">
                            <span
                              className="uk-form-icon"
                              uk-icon="icon: user"
                            />
                            <input
                              name="email"
                              value={this.state.email}
                              onChange={this.onChange}
                              className="uk-input"
                              type="text"
                              placeholder="Email"
                            />
                          </div>
                        </div>
                        <div className="uk-margin">
                          <div className="uk-inline">
                            <button
                              className="uk-button uk-button-primary btn-border"
                              onClick={this.resetPassword}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="uk-margin">
                      <div className="uk-inline">
                        <a href="#" onClick={this.loginMode}>
                          Login
                        </a>{' '}
                        |{' '}
                        <a href="#" onClick={this.createMode}>
                          Create new Account
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="uk-container uk-flex uk-flex-middle login-footer">
          <p>
            Copyright &copy; {new Date().getFullYear()} Cryptobitloco.
            &nbsp;All&nbsp;rights reserved. &nbsp;
          </p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginAction: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default connect(null, { loginAction })(withRouter(Login));
