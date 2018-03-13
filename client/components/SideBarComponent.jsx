import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logoutAction from '../actions/logoutAction';
import { deleteStore } from '../actions/userAction'; //

/**
 * Dashboard component
 * @class Dashboard
 * @extends {Component}
 */
class SideBarComponent extends Component {
  /**
   * Creates an instance of Dashboard.
   * @param {any} props
   * @memberOf Dashboard
   */
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.auth.user,
      loading: true
    };
    this.logOut = this.logOut.bind(this);
  }
  /**
   * Logs a user out
   * @param {any} e
   * @returns {void}
   * @memberOf Dashboard
   */
  logOut(e) {
    e.preventDefault();
    this.props.deleteStore();
    this.props.logoutAction();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.auth.user
    });
  }

  /**
   * Renders the Dashboard component
   * @method render
   * @returns {void}
   * @memberOf Dashboard
   */
  render() {
    return (
      <div>
        <div className="uk-offcanvas-content">
          <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">
            <nav
              className="uk-navbar-container"
              uk-navbar={true.toString()}
              style={{ position: 'relative', zIndex: 980 }}
            >
              <div className="uk-navbar-left">
                <a
                  uk-navbar-toggle-icon=""
                  href="#offcanvas"
                  uk-toggle=""
                  className="uk-navbar-toggle uk-hidden@m uk-navbar-toggle-icon uk-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    ratio="1"
                  >
                    <rect y="9" width="20" height="2" />
                    <rect y="3" width="20" height="2" />
                    <rect y="15" width="20" height="2" />
                  </svg>
                </a>
                <a className="uk-navbar-item uk-logo" href="#">
                  <img src="/imgs/cryto-logo.png" alt="logo" />
                </a>
              </div>
              <div className="uk-navbar-right">
                <ul className="uk-navbar-nav uk-visible@m">
                  <li className="uk-active">
                    <a href="#">
                      <span uk-icon="icon: user" /> {this.state.user.fname}
                    </a>
                  </li>
                  <li className="uk-active">
                    <a href="#" onClick={this.logOut}>
                      <span uk-icon="icon: sign-out" /> Logout
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="tm-sidebar-left uk-visible@m">
            <ul className="uk-nav uk-nav-default tm-nav">
              <li className="uk-nav-header">{this.state.user.fname}</li>{' '}
              <li>
                <Link to="/dashboard" href="/dashboard">
                  Dashboard
                </Link>
              </li>
              {/* <li className="">
                <a href="#">My Contracts</a>
              </li>
              <li className="">
                <a href="#">My Earnings</a>
              </li> */}
              <li className="">
                <Link to="/profile" href="/profile">
                  Profile
                </Link>
              </li>
            </ul>
            {this.state.user.roleId === 1 && (
              <ul className="uk-nav uk-nav-default tm-nav uk-margin-top">
                <li className="uk-nav-header">Admin</li>{' '}
                <li>
                  <Link to="/admin" href="/admin">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/users" href="/users">
                    Users
                  </Link>
                </li>
                <li>
                  <Link to="/contracts" href="/contracts">
                    Contracts
                  </Link>
                </li>
                <li>
                  <Link to="/earnings" href="/earnings">
                    Earnings
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="tm-main uk-section uk-section-default">
            <div className="uk-container uk-container-small uk-position-relative">
              {this.props.component}
            </div>
          </div>

          <div
            id="offcanvas"
            uk-offcanvas="mode: push; overlay: true"
            className="uk-offcanvas"
          >
            <div className="uk-offcanvas-bar">
              <div className="uk-panel">
                <ul className="uk-nav uk-nav-default tm-nav">
                  <li className="uk-nav-header">{this.state.user.fname}</li>{' '}
                  <Link to="/dashboard" href="/dashboard">
                    Dashboard
                  </Link>
                </ul>
                {this.state.user.roleId === 1 && (
                  <ul className="uk-nav uk-nav-default tm-nav uk-margin-top">
                    <li className="uk-nav-header">Admin</li>{' '}
                    <Link to="/admin" href="/admin">
                      Dashboard
                    </Link>
                    <li>
                      <Link to="/contracts" href="/contracts">
                        Contracts
                      </Link>
                    </li>
                    <li>
                      <Link to="/earnings" href="/earnings">
                        Earnings
                      </Link>
                    </li>
                  </ul>
                )}
                <ul className="uk-nav uk-nav-default tm-nav">
                  <li className="uk-active">
                    <a href="#" onClick={this.logOut}>
                      <span uk-icon="icon: sign-out" /> Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

SideBarComponent.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape({}).isRequired
  }).isRequired,
  logoutAction: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  logoutAction,
  deleteStore
})(SideBarComponent);
