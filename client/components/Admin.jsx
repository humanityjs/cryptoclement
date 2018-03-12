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
import { getSingleUser, deleteStore, getAllUsers } from '../actions/userAction';

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
      user: this.props.auth.user,
      details: this.props.user,
      loading: true,
      allContracts: [],
      allContractSum: 0,
      totalEarnings: 0,
      allEarnings: [],
      username: '',
      email: '',
      fname: '',
      lname: '',
      streetAddress: '',
      btcAddress: '',
      roledId: '',
      password: '',
      errors: {},
      startDateCa: moment(),
      startDate: '',
      userUUID: '',
      value: '',
      earningDate: moment(),
      th: '',
      todayEarnings: ''
    };
    this.logOut = this.logOut.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onUserSubmit = this.onUserSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEarningChange = this.handleEarningChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.selectOptionChange = this.selectOptionChange.bind(this);
    this.onContractSubmit = this.onContractSubmit.bind(this);
    this.onEarningSubmit = this.onEarningSubmit.bind(this);
  }

  /**
   * Loads user's details on load
   * @method componentDidMount
   * @returns {void}
   * @memberOf Dashboard
   */
  componentDidMount() {
    this.props.getSingleUser(this.state.user.uuid).then(() => {
      this.props.getAllUsers();
      axios.get('/api/contracts').then(({ data }) => {
        this.setState({
          allContractSum: data.contractSum,
          allContracts: data.contracts.rows
        });
      });
      axios.get('/api/earnings').then(({ data }) => {
        this.setState({
          totalEarnings: data.totalEarnings,
          allEarnings: data.earnings.rows
        });
      });
    });
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

  handleChange(date) {
    this.setState({
      startDateCa: date,
      startDate: date
    });
  }

  handleEarningChange(date) {
    this.setState({
      earningDate: date
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

  /**
   * Add new users
   * @method onUserSubmit
   * @returns {void}
   * @memberOf Admin
   */
  onUserSubmit() {
    const data = { ...this.state, passwordConfirmation: this.state.password };
    this.setState({
      errors: {}
    });
    axios.post('/api/users', data).then(
      () => {
        this.props.getAllUsers();
        swal({
          title: 'Success',
          html: 'User added successfully!',
          type: 'success',
          allowOutsideClick: false
        }).then(() => {
          $('#modal-example').modal('hide');
        });
      },
      ({ response }) => {
        console.log(response.data);
        this.setState({
          errors: response.data.errors
        });
      }
    );
  }

  /**
   * Fetch names that matches what the user is typing
   * @param {any} input
   * @returns {void}
   * @memberOf Documents
   */
  getOptions(input) {
    return axios.get(`/api/users/search?q=${input}`).then(({ data }) => {
      const options = data.map(user => ({
        value: user.uuid,
        label: `${user.fname} ${user.lname} - ${user.username}`
      }));
      return { options };
    });
  }

  /**
   * Set the student's name to state on change
   * @param {any} val
   * @returns {void}
   * @memberOf Documents
   */
  selectOptionChange(val) {
    this.setState({
      userUUID: val.value //
    });
  }

  onContractSubmit(e) {
    e.preventDefault();
    axios.post('/api/contracts', this.state).then(
      () => {
        this.setState({
          userUUID: '',
          value: '',
          startDateCa: moment()
        });
        axios.get('/api/contracts').then(({ data }) => {
          this.setState({
            allContractSum: data.contractSum,
            allContracts: data.contracts.rows
          });
          swal({
            title: 'Success',
            html: 'Contract added successfully!',
            type: 'success',
            allowOutsideClick: false
          }).then(() => {
            $('#contract-modal').modal('hide');
          });
        });
      },
      ({ response }) => {
        console.table(response);
      }
    );
  }

  onEarningSubmit(e) {
    e.preventDefault();
    const data = {
      earnings: this.state.todayEarnings,
      th: this.state.th,
      eDate: this.state.earningDate
    };

    if (!data.earnings || !data.th) {
      swal({
        title: 'Error',
        text: 'Please fill all the fields',
        type: 'error',
        allowOutsideClick: false
      });
    } else {
      swal({
        title: 'Confirm Date',
        text: `Add earnings for ${moment(data.eDate).format('YYYY-MM-DD')} @ ${
          data.th
        } TH/s`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {
          axios.post('/api/earnings', data).then(
            () => {
              this.setState({
                earnings: '',
                th: '',
                earningDate: moment()
              });
              axios.get('/api/earnings').then(({ data }) => {
                this.setState({
                  totalEarnings: data.totalEarnings,
                  allEarnings: data.earnings.rows
                });
                swal({
                  title: 'Success',
                  html: 'Earning added successfully!',
                  type: 'success',
                  allowOutsideClick: false
                }).then(() => {
                  $('#earnings-modal').modal('hide');
                });
              });
            },
            ({ response }) => {
              const errors = response.data.errors;
              let html;
              if (errors && errors.earnings && errors.th) {
                html = `${errors.earnings} <br /> ${errors.th}`;
              } else if (errors && errors.earnings && !errors.th) {
                html = `${errors.earnings}`;
              } else if (errors && !errors.earnings && errors.th) {
                html = `${errors.th}`;
              } else {
                html = `${response.data.message}`;
              }
              swal({
                title: 'Error',
                html,
                type: 'error',
                allowOutsideClick: false
              });
            }
          );
        }
      });
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
    this.props.deleteStore();
    this.props.logoutAction();
  }

  /**
   * Renders the Dashboard component
   * @method render
   * @returns {void}
   * @memberOf Dashboard
   */
  render() {
    const { users } = this.state.details;
    const {
      allContractSum, allContracts, totalEarnings, errors
    } = this.state;

    const trimamount = amount =>
      amount
        .toString()
        .split('')
        .slice(0, 12)
        .join('');

    return (
      <div>
        <div className="uk-container uk-container-small uk-position-relative p0">
          <section id="1" className="b-main">
            <div className="uk-section uk-section-default">
              <div className="uk-container">
                <h3 className="ml-15 bb">OVERVIEW</h3>

                <div
                  className="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m uk-grid-match"
                  uk-grid={true.toString()}
                >
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-default uk-card-body">
                      <div>
                        <h3 className="uk-card-title">TOTAL USERS</h3>
                        <p>{users.length}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-primary uk-card-body">
                      <div>
                        <h3 className="uk-card-title">ALL CONTRACTS</h3>
                        <p>{allContracts.length}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-secondary uk-card-body">
                      <div>
                        <h3 className="uk-card-title">CONTRACTS HASHRATE</h3>
                        <p>{trimamount(allContractSum)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-primary uk-card-body">
                      <div>
                        <h3 className="uk-card-title">TOTAL EARNINGS</h3>
                        <p>{trimamount(totalEarnings)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-secondary uk-card-body">
                      <div>
                        <h3 className="uk-card-title">PAYOUTS</h3>
                        <p>0</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-default uk-card-body">
                      <div>
                        <h3 className="uk-card-title">PENDING PAYOUTS</h3>
                        <p>0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="2" className="b-main">
            <div className="uk-section uk-section-primary uk-light">
              <div className="uk-container">
                <h3 className="bbw">ACTIONS</h3>
                <div
                  className="uk-grid-small uk-child-width-1-3@s uk-grid-match"
                  uk-grid={true.toString()}
                >
                  <div>
                    <button
                      className="uk-button uk-button-default uk-margin-small-right"
                      type="button"
                      uk-toggle="target: #modal-example"
                    >
                      Add User
                    </button>
                  </div>
                  <div>
                    <button
                      className="uk-button uk-button-default uk-margin-small-right"
                      type="button"
                      uk-toggle="target: #contract-modal"
                    >
                      Add Contract
                    </button>
                  </div>
                  <div>
                    <button
                      className="uk-button uk-button-default uk-margin-small-right"
                      type="button"
                      uk-toggle="target: #earnings-modal"
                    >
                      Add Earnings
                    </button>
                  </div>
                </div>
              </div>
              {/* Modal 1 */}
              <div id="modal-example" uk-modal={true.toString()}>
                <div className="uk-modal-dialog uk-modal-body uk-flex uk-flex-center uk-flex-middle">
                  <div className="center">
                    <div className="center">
                      <h3>Add new user</h3>

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
                          <select
                            className="uk-select"
                            onChange={this.onChange}
                            name="roleId"
                          >
                            <option>Please select role</option>
                            <option value="1">Admin</option>
                            <option value="2">Regular</option>
                          </select>
                        </div>
                        <span>{errors.roledId && errors.roledId}</span>
                      </div>
                    </div>
                    <p className="uk-text-right">
                      <button
                        className="uk-button uk-button-default uk-modal-close"
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="uk-button uk-button-primary"
                        type="button"
                        onClick={this.onUserSubmit}
                      >
                        Save
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal 2 */}
              <div id="contract-modal" uk-modal={true.toString()}>
                <div className="uk-modal-dialog uk-modal-body uk-flex uk-flex-center uk-flex-middle">
                  <div className="center">
                    <div className="center">
                      <h3>Add new contract</h3>

                      <div className="uk-margin">
                        <div className="uk-inline">
                          <span className="uk-form-icon" uk-icon="icon: user" />
                          <Select.Async
                            name="form-field-name"
                            value={this.state.userUUID}
                            onChange={this.selectOptionChange}
                            loadOptions={this.getOptions}
                          />
                        </div>
                        <span>{errors.fname && errors.fname}</span>
                      </div>
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <span className="uk-form-icon" uk-icon="icon: user" />
                          <input
                            name="value"
                            value={this.state.value}
                            onChange={this.onChange}
                            className="uk-input"
                            type="number"
                            placeholder="Value"
                          />
                        </div>
                        <span>{errors.value && errors.value}</span>
                      </div>
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <span className="uk-form-icon" uk-icon="icon: user" />
                          <DatePicker
                            selected={this.state.startDateCa}
                            onChange={this.handleChange}
                            className="uk-input"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="uk-text-right">
                      <button
                        className="uk-button uk-button-default uk-modal-close"
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="uk-button uk-button-primary"
                        type="button"
                        onClick={this.onContractSubmit}
                      >
                        Save
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal 3 */}
              <div id="earnings-modal" uk-modal={true.toString()}>
                <div className="uk-modal-dialog uk-modal-body uk-flex uk-flex-center uk-flex-middle">
                  <div className="center">
                    <div className="center">
                      <h3>Add earnings</h3>

                      <div className="uk-margin">
                        <div className="uk-inline">
                          <span className="uk-form-icon" uk-icon="icon: user" />
                          <input
                            name="todayEarnings"
                            value={this.state.todayEarnings}
                            onChange={this.onChange}
                            className="uk-input"
                            type="text"
                            placeholder="Earnings"
                          />
                        </div>
                        <span>{errors.earnings && errors.earnings}</span>
                      </div>
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <span className="uk-form-icon" uk-icon="icon: user" />
                          <input
                            name="th"
                            value={this.state.th}
                            onChange={this.onChange}
                            className="uk-input"
                            type="text"
                            placeholder="Hash Rate"
                          />
                        </div>
                        <span>{errors.value && errors.value}</span>
                      </div>
                      <div className="uk-margin">
                        <div className="uk-inline">
                          <span className="uk-form-icon" uk-icon="icon: user" />
                          <DatePicker
                            selected={this.state.earningDate}
                            onChange={this.handleEarningChange}
                            className="uk-input"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="uk-text-right">
                      <button
                        className="uk-button uk-button-default uk-modal-close"
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="uk-button uk-button-primary"
                        type="button"
                        onClick={this.onEarningSubmit}
                      >
                        Save
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
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
  getSingleUser,
  deleteStore,
  getAllUsers
})(Admin);
