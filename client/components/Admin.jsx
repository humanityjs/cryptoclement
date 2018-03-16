import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import moment from 'moment';
import axios from 'axios';
import $ from 'jquery';
import swal from 'sweetalert2';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import logoutAction from '../actions/logoutAction';
import { getAdmin, getAllUsers, creditUser } from '../actions/userAction';

/**
 * Dashboard component
 * @class Dashboard
 * @extends {Component}
 */
class Admin extends Component {
  /**
   * Creates an instance of Dashboard.
   * @param {any} props
   * @memberOf Dashboard
   */
  constructor(props) {
    super(props);
    this.state = {
      earnUsername: '',
      earnAmount: '',
      earnEmail: '',
      earnSite: '',
      earnSitename: '',
      earnType: '',
      error: ''
    };
    this.payouts = this.payouts.bind(this);
    this.sites = this.sites.bind(this);
    this.status = this.status.bind(this);
    this.onChange = this.onChange.bind(this);
    this.earnSubmit = this.earnSubmit.bind(this);
    this.confirmPayment = this.confirmPayment.bind(this);
    this.verifySite = this.verifySite.bind(this);
    this.users = this.users.bind(this);
  }

  /**
   * Loads user's details on load
   * @method componentDidMount
   * @returns {void}
   * @memberOf Dashboard
   */
  componentDidMount() {
    this.props.getAdmin();
    this.props.getAllUsers();
  }

  /**
   * Listen for prop changes
   * @method componentWillReceiveProps
   * @param {any} nextProps
   * @returns {void}
   * @memberOf Dashboard
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      details: nextProps.user,
      loading: false
    });
  }

  /**
   * Handles change event
   * @param {any} e
   * @returns {void}
   * @memberOf Admin
   */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  confirmPayment(id) {
    axios.post('/api/admin/confirm-payment', { id })
      .then(() => {
        swal({
          title: 'Success',
          html: 'Payment Confirmed Successfully',
          type: 'success',
          allowOutsideClick: false
        })
          .then(() => {
            this.props.getAdmin();
          });
      }, (({ response }) => {
        swal({
          title: 'Error',
          html: response.data.message,
          type: 'error',
          allowOutsideClick: false
        });
      }));
  }

  verifySite(id, status) {
    axios.post('/api/admin/confirm-site', { id, status })
      .then(() => {
        swal({
          title: 'Success',
          html: 'Site confirmed successfully!',
          type: 'success',
          allowOutsideClick: false
        })
          .then(() => {
            this.props.getAdmin();
          });
      }, (({ response }) => {
        swal({
          title: 'Error',
          html: response.data.message,
          type: 'error',
          allowOutsideClick: false
        });
      }));
  }

  payouts() {
    let Payout;
    const { payouts } = this.props.admin;
    if (payouts.length > 0) {
      Payout = payouts.map((payout, i) => (
        <tr key={i}>
          <td>{payout.email}</td>
          <td>{payout.amount}</td>
          <td>{payout.type.toUpperCase()}</td>
          <td>{payout.address}</td>
          <td>{payout.status === 0 ? 'pending' : 'paid'}</td>
          <td>
            <button
              onClick={() => this.confirmPayment(payout.id)}
              className="cmn-btn confirm"
              disabled={payout.status === 1}
            >
              {payout.status === 1 ? 'Confirmed' : 'Confirm'}
            </button>
          </td>
        </tr>
      ));
    } else {
      Payout = (
        <tr>
          <td colSpan="6" style={{ textAlign: 'center' }}>
            No payout requests at this time.
          </td>
        </tr>
      );
    }

    return Payout;
  }

  users() {
    let User;
    const { users } = this.props.user;
    if (users.length > 0) {
      User = users.map((user, i) => (
        <tr key={i}>
          <td>{user.email}</td>
          <td>{user.role === 1 ? 'Admin' : 'Regular User'}</td>
        </tr>
      ));
    } else {
      User = (
        <tr>
          <td colSpan="2" style={{ textAlign: 'center' }}>
            No user to display
          </td>
        </tr>
      );
    }

    return User;
  }

  status(num) {
    switch (num) {
      case 0:
        return <i className="material-icons">timer</i>;
      case 1:
        return <i className="material-icons">check</i>;
      default:
        return <i className="material-icons">close</i>;
    }
  }

  sites() {
    let Site;
    const { sites } = this.props.admin;
    if (sites.length > 0) {
      Site = sites.map((site, i) => (
        <tr key={i}>
          <td>{site.site_name}</td>
          <td>
            {site.username} &nbsp;
            {this.status(site.status)}
          </td>
          <td>{site.email}</td>
          <td>
            {site.status === 0 ? (
              <span>
                <button
                  onClick={() => this.verifySite(site.id, 1)}
                  className="cmn-btn"
                >
                  Valid
                </button>
                <button
                  className="cmn-btn"
                  style={{ backgroundColor: 'red' }}
                  onClick={() => this.verifySite(site.id, 2)}
                >
                  Invalid
                </button>
              </span>
            ) : (
                <button id="submit" disabled>
                  Verified
                </button>
              )}
          </td>
        </tr>
      ));
    } else {
      Site = (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>
            No registered Sites yet.
          </td>
        </tr>
      );
    }

    return Site;
  }

  earnSubmit(e) {
    e.preventDefault();
    this.setState({
      error: ''
    });
    const {
      earnAmount,
      earnEmail,
      earnSite,
      earnSitename,
      earnType,
      earnUsername
    } = this.state;
    if (
      !earnAmount ||
      !earnEmail ||
      !earnSite ||
      !earnSitename ||
      !earnType ||
      !earnUsername
    ) {
      this.setState({
        error: 'Please fill all fields'
      });
      return;
    }
    this.props
      .creditUser({
        amount: earnAmount,
        email: earnEmail,
        siteName: earnSite,
        siteType: earnSitename,
        type: earnType,
        username: earnUsername
      })
      .then((res) => {
        if (res) {
          swal({
            title: 'Success',
            html: 'User credited successfully!',
            type: 'success',
            allowOutsideClick: false
          }).then(() => {
            this.setState({
              earnUsername: '',
              earnAmount: '',
              earnEmail: '',
              earnSite: '',
              earnSitename: '',
              earnType: '',
              error: ''
            });
          });
        }
      });
  }

  /**
   * Renders the Dashboard component
   * @method render
   * @returns {void}
   * @memberOf Dashboard
   */
  render() {
    const { error } = this.state;
    return (
      <section id="main" className="sec-pad poker">
        <div className="container">
          <div className="row">
            <div className="d-flex flex-row mt-2">
              <ul
                className="nav nav-tabs nav-tabs--vertical nav-tabs--left"
                role="navigation"
              >
                <li className="nav-item">
                  <a
                    href="#lorem"
                    className="nav-link active"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="lorem"
                  >
                    EARNINGS
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#ipsum"
                    className="nav-link"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="ipsum"
                  >
                    PAYOUTS
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#sit-amet"
                    className="nav-link"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="sit-amet"
                  >
                    SITES
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#users"
                    className="nav-link"
                    data-toggle="tab"
                    role="tab"
                    aria-controls="sit-amet"
                  >
                    USERS
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="lorem"
                  role="tabpanel"
                >
                  <div className="flex">
                    <div className="flex-first">
                      <div className="convert">
                        <h5>CREDIT USER</h5>
                        {error && (
                          <div className="error">{error}</div>
                        )}
                        <div className="form-group">
                          <label className="small" htmlFor="earnUsername">
                            Enter Username
                          </label>
                          <input
                            onChange={this.onChange}
                            value={this.state.earnUsername}
                            type="text"
                            className="form-control"
                            name="earnUsername"
                            aria-describedby="earnUsername"
                            placeholder="Enter Username"
                          />
                        </div>
                        <div className="form-group">
                          <label className="small" htmlFor="earnEmail">
                            Enter User Email
                          </label>
                          <input
                            onChange={this.onChange}
                            value={this.state.earnEmail}
                            type="text"
                            className="form-control"
                            name="earnEmail"
                            aria-describedby="earnUsername"
                            placeholder="Enter Email"
                          />
                        </div>
                        <div className="form-group">
                          <label className="small" htmlFor="earnSite">
                            Select Site
                          </label>
                          <select
                            onChange={this.onChange}
                            value={this.state.earnSite}
                            className="form-control"
                            name="earnSite"
                            id="earnSite"
                          >
                            <option value="">Please select</option>
                            <option value="sports">Sports</option>
                            <option value="tools">Tools</option>
                            <option value="trading">Trading</option>
                            <option value="poker">Poker</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="small" htmlFor="earnSitename">
                            Select Sitename
                          </label>
                          <select
                            onChange={this.onChange}
                            value={this.state.earnSitename}
                            className="form-control"
                            name="earnSitename"
                            id="earnSitename"
                          >
                            <option value="">Please select</option>
                            <option value="americas-cardroom">
                              Americas Cardroom
                            </option>
                            <option value="betonline">Betonline</option>
                            <option value="blackchip-poker">
                              BlackChip poker
                            </option>
                            <option value="intertoops">Intertoops</option>
                            <option value="nitogensports">
                              Nitrogen Sports
                            </option>
                            <option value="swc">SWC</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="small" htmlFor="earnAmount">
                            Enter Amount
                          </label>
                          <input
                            onChange={this.onChange}
                            value={this.state.earnAmount}
                            type="number"
                            className="form-control"
                            name="earnAmount"
                            aria-describedby="earnAmount"
                            placeholder="Enter Amount"
                          />
                        </div>

                        <div className="form-group">
                          <label className="small" htmlFor="earnType">
                            Select currency
                          </label>
                          <select
                            onChange={this.onChange}
                            value={this.state.earnType}
                            className="form-control"
                            name="earnType"
                            id="earnType"
                          >
                            <option value="">Please select</option>
                            <option value="USD">USD</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                            <option value="BCH">BCH</option>
                            <option value="LTC">LTC</option>
                            <option value="DASH">DASH</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <button onClick={this.earnSubmit} className="cmn-btn">
                            CREDIT USER
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-second" />
                  </div>
                </div>

                {/* <!-- 2nd --> */}
                <div className="tab-pane fade" id="ipsum" role="tabpanel">
                  <div className="history">
                    <h5>PAYOUT REQUESTS</h5>
                    <div className="history-list">
                      <p>Pocker</p>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>EMAIL</th>
                            <th>AMOUNT</th>
                            <th>CURRENCY</th>
                            <th>ADDRESS</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>{this.payouts()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* <!-- 3rd --> */}
                <div className="tab-pane fade" id="sit-amet" role="tabpanel">
                  <div className="history">
                    <h5>HISTORY</h5>
                    <div className="history-list">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SITES</th>
                            <th>USERNAME</th>
                            <th>EMAIL</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>{this.sites()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* <!-- 4th --> */}
                <div className="tab-pane fade" id="users" role="tabpanel">
                  <div className="history">
                    <h5>USERS</h5>
                    <div className="history-list">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                          </tr>
                        </thead>
                        <tbody>{this.users()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin,
  user: state.user
});

Admin.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape({}).isRequired
  }).isRequired,
  logoutAction: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  logoutAction,
  getAdmin,
  getAllUsers,
  creditUser
})(Admin);
