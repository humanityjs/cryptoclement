import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert2';
import { getSingleUser } from '../actions/userAction';

/**
 * Dashboard component
 * @class Dashboard
 * @extends {Component}
 */
class Dashboard extends Component {
  /**
   * Creates an instance of Dashboard.
   * @param {any} props
   * @memberOf Dashboard
   */
  constructor(props) {
    super(props);
    this.state = {
      cryptocurrencyToCovertTo: '',
      amountToConvert: 0,
      conversionRate: 0,
      error: '',
      cashOutCrypto: '',
      cashOutAmount: 0,
      cashOutAddress: '',
      passwordError: '',
      currentPass: '',
      newPass: '',
      newPassConfirm: '',
      qrError: '',
      token: '',
      stage2: false,
      secretToken: ''
    };
    // this.logOut = this.logOut.bind(this);
    this.status = this.status.bind(this);
    this.tools = this.tools.bind(this);
    this.sports = this.sports.bind(this);
    this.pokers = this.pokers.bind(this);
    this.tradings = this.tradings.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.histories = this.histories.bind(this);
    this.onChange = this.onChange.bind(this);
    this.convert = this.convert.bind(this);
    this.convertIt = this.convertIt.bind(this);
    this.cashOut = this.cashOut.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.generateQR = this.generateQR.bind(this);
    this.confirmToken = this.confirmToken.bind(this);
    this.disableTfa = this.disableTfa.bind(this);
  }

  /**
   * Loads user's details on load
   * @method componentDidMount
   * @returns {void}
   * @memberOf Dashboard
   */
  componentDidMount() {
    this.props.getSingleUser();
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

  onChange(e) {
    e.preventDefault();
    if (e.target.name === 'cryptocurrencyToCovertTo') {
      this.convertIt(e.target.value);
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  convertIt(type) {
    axios
      .get(`https://rest.coinapi.io/v1/exchangerate/USD/${type}`, {
        headers: {
          'X-CoinAPI-Key': '7CF89C06-9A4D-4701-80C7-A6CA5F315B93'
        },
      })
      .then(({ data }) => {
        this.setState({
          conversionRate: data.rate
        });
      });
  }

  convert() {
    const { amountToConvert, cryptocurrencyToCovertTo, conversionRate } = this.state;
    this.setState({
      error: ''
    });
    if (!amountToConvert || !cryptocurrencyToCovertTo) {
      this.setState({
        error: 'Please fill all the fields'
      });
      return;
    }
    const converted = (amountToConvert * conversionRate) - ((1 / 100) * (amountToConvert * conversionRate));
    axios.post('/api/finance/convert', {
      amount: amountToConvert,
      value: converted,
      type: cryptocurrencyToCovertTo
    }).then(() => {
      this.props.getSingleUser();
      swal({
        title: 'Success',
        html: 'Conversion successful!',
        type: 'success',
        allowOutsideClick: false
      }).then(() => {
        this.setState({
          amountToConvert: 0,
          conversionRate: 0,
          cryptocurrencyToCovertTo: ''
        });
      });
    }, ({ response }) => {
      swal({
        title: 'Error',
        html: response.data.message,
        type: 'error',
        allowOutsideClick: false //
      });
    });
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

  pokers() {
    let Poker;
    const { sites } = this.props.user;
    const pokers = sites.filter(site => site.site_type === 'poker');
    if (pokers.length > 0) {
      Poker = pokers.map((poker, i) => (
        <tr key={i}>
          <td>{poker.site_name}</td>
          <td>
            {poker.username} &nbsp;
            {this.status(poker.status)}
          </td>
          <td>{poker.bonus}</td>
          <td>{poker.rakeback_one}</td>
        </tr>
      ));
    } else {
      Poker = (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>
            No sites under Poker yet.
          </td>
        </tr>
      );
    }
    return Poker;
  }

  tradings() {
    let Trading;
    const { sites } = this.props.user;
    const tradings = sites.filter(site => site.site_type === 'trading');
    if (tradings.length > 0) {
      Trading = tradings.map((trading, i) => (
        <tr key={i}>
          <td>{trading.site_name}</td>
          <td>
            {trading.username} &nbsp;
            {this.status(trading.status)}
          </td>
          <td>{trading.free_rebate}</td>
        </tr>
      ));
    } else {
      Trading = (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>
            No sites under Tradings yet.
          </td>
        </tr>
      );
    }

    return Trading;
  }

  sports() {
    let Sport;
    const { sites } = this.props.user;
    const sports = sites.filter(site => site.site_type === 'sports');
    if (sports.length > 0) {
      Sport = sports.map((sport, i) => (
        <tr key={i}>
          <td>{sport.site_name}</td>
          <td>
            {sport.username} &nbsp;
            {this.status(sport.status)}
          </td>
          <td>{sport.betback}</td>
          <td>{sport.lossback}</td>
        </tr>
      ));
    } else {
      Sport = (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>
            No sites under Sports yet.
          </td>
        </tr>
      );
    }

    return Sport;
  }

  tools() {
    let Tool;

    const { sites } = this.props.user;
    const tools = sites.filter(site => site.site_type === 'tools');

    if (tools.length > 0) {
      Tool = tools.map((tool, i) => (
        <tr key={i}>
          <td>{tool.site_name}</td>
          <td>
            {tool.username} &nbsp;
            {this.status(tool.status)}
          </td>
          <td>{tool.free_rebate}</td>
          <td>{tool.rewards}</td>
        </tr>
      ));
    } else {
      Tool = (
        <tr>
          <td colSpan="4" style={{ textAlign: 'center' }}>
            No sites under Tools yet.
          </td>
        </tr>
      );
    }

    return Tool;
  }

  checkValue(value, type) {
    if (type === 'payout') {
      return value === 0 ? 'pending' : 'processed';
    }
    return value;
  }

  histories() {
    let History;
    const { histories } = this.props.user;
    if (histories.length > 0) {
      History = histories.map((history, i) => (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{history.username}</td>
          <td>{this.formatDate(history.date)}</td>
          <td>{history.type}</td>
          <td>{history.amountType}</td>
          <td>{history.amount || ''}</td>
          <td>{this.checkValue(history.value, history.type)}</td>
        </tr>
      ));
    } else {
      History = (
        <tr>
          <td colSpan="7" style={{ textAlign: 'center' }}>
            You have no histories to show
          </td>
        </tr>
      );
    }

    return History;
  }

  formatDate(date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const day = new Date(date).getDate();

    return `${year}-${month}-${day}`;
  }

  cashOut() {
    const { cashOutAddress, cashOutAmount, cashOutCrypto } = this.state;
    this.setState({
      error: ''
    });
    if (!cashOutAddress || !cashOutAmount || !cashOutCrypto) {
      this.setState({
        error: 'Please fill all fields'
      });
      return;
    }
    axios.post('/api/finance/payout', {
      amount: cashOutAmount,
      address: cashOutAddress,
      type: cashOutCrypto
    })
      .then(() => {
        this.props.getSingleUser();
        swal({
          title: 'Success',
          html: 'Payout request successful!',
          type: 'success',
          allowOutsideClick: false
        }).then(() => {
          this.setState({
            cashOutAmount: 0,
            cashOutAddress: '',
            cashOutCrypto: ''
          });
        });
      }, ({ response }) => {
        swal({
          title: 'Error',
          html: response.data.message,
          type: 'error',
          allowOutsideClick: false //
        });
      });
  }

  changePassword() {
    const { currentPass, newPass, newPassConfirm } = this.state;
    this.setState({
      passwordError: ''
    });
    if (!currentPass || !newPass || !newPassConfirm) {
      this.setState({
        passwordError: 'Please fill all fields'
      });
      return;
    }
    if (newPass !== newPassConfirm) { //
      this.setState({
        passwordError: 'Password does not match'
      });
      return;
    }
    axios.post('/api/auth/change-password', { newPass, currentPass })
      .then(() => {
        swal({
          title: 'Success',
          html: 'Password changed successfully',
          type: 'success',
          allowOutsideClick: false
        }).then(() => {
          this.setState({
            newPass: '',
            currentPass: '',
            newPassConfirm: ''
          });
        });
      }, ({ response }) => {
        swal({
          title: 'Error',
          html: response.data.message,
          type: 'error',
          allowOutsideClick: false
        });
      });
  }

  generateQR() {
    axios.post('/api/auth/generate-2fa').then(({ data }) => {
      this.setState({
        qrImg: data.dataURL,
        secretToken: data.tempSecret,
        stage2: true
      });
    }, ({ response }) => {
      this.setState({
        qrError: response.data.message
      });
    });
  }

  confirmToken() {
    this.setState({
      qrError: ''
    });
    axios.post('/api/auth/verify-2fa', { token: this.state.token }).then(({ data }) => {
      window.localStorage.setItem('jwtTokenBTCGrinders', data.token);
      swal({
        title: 'Success',
        html: 'Two factor authentication added successfully',
        type: 'success',
        allowOutsideClick: false
      }).then(() => {
        window.location.reload();
      });
    }, ({ response }) => {
      this.setState({
        qrError: response.data.message
      });
    });
  }

  disableTfa() {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Disable 2fa'
    }).then((result) => {
      if (result.value) {
        axios.post('/api/auth/disable-2fa').then(({ data }) => {
          window.localStorage.setItem('jwtTokenBTCGrinders', data.token);
          swal(
            'Success!',
            '2fa disabled successfully',
            'success'
          ).then(() => {
            window.location.reload();
          });
        }, ({ response }) => {
          swal(
            'Error',
            response.data.message,
            'error'
          );
        });
      }
    });
  }

  render() {
    const { user } = this.props;
    const {
      conversionRate, amountToConvert, error, passwordError
    } = this.state;
    const converted = (amountToConvert * conversionRate) - ((1 / 100) * (amountToConvert * conversionRate));
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
                    CASHIER
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
                    SITES
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
                    HISTORY
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
                      <div className="settings">
                        <div className="form-group">
                          {
                            this.props.auth.user.tfa ? (
                              <button
                                id="submit"
                                className="btn btn-primary"
                                onClick={this.disableTfa}
                              >
                                Disable 2-factor Authentication
                              </button>
                            ) : (
                              <button
                                  id="submit"
                                  className="btn btn-primary"
                                  data-toggle="modal"
                                  data-target="#2fa"
                                >
                                  Add 2-factor Authentication
                                </button>
                              )
                          }
                        </div>
                        <div className="form-group">
                          <button
                            id="submit"
                            className="btn btn-primary"
                            data-toggle="modal"
                            data-target="#changePass"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                      <div className="balance">
                        <h5>BALANCES</h5>
                        <p>
                          USD: $
                          {user.earnings.usd}
                        </p>
                        <p>
                          BTC:&nbsp;
                          {user.earnings.btc}
                        </p>
                        <p>
                          ETH:&nbsp;
                          {user.earnings.eth}
                        </p>
                        <p>
                          LTC:&nbsp;
                          {user.earnings.ltc}
                        </p>
                        <p>
                          BCH:&nbsp;
                          {user.earnings.bch}
                        </p>
                        <p>
                          DASH:&nbsp;
                          {user.earnings.dash}
                        </p>
                      </div>
                      <div className="convert">
                        <h5>CONVERT TO CRYPTOCURRENCY</h5>
                        {error && (
                          <div className="error">{error}</div>
                        )}
                        <div className="form-group">
                          <label
                            className="small"
                            htmlFor="cryptocurrencyToCovertTo"
                          >
                            Select cryptocurrency
                          </label>
                          <select
                            className="form-control"
                            name="cryptocurrencyToCovertTo"
                            id="cryptocurrencyToCovertTo"
                            onChange={this.onChange}
                            value={this.state.cryptocurrencyToCovertTo}
                          >
                            <option value="" disabled>
                              SELECT ONE
                            </option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                            <option value="BCH">BCH</option>
                            <option value="LTC">LTC</option>
                            <option value="DASH">DASH</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="small" htmlFor="amountToConvert">
                            Enter Amount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="amountToConvert"
                            value={this.state.amountToConvert}
                            onChange={this.onChange}
                            aria-describedby="amountToConvert"
                            placeholder="Enter Amount"
                          />
                          <div className="realtime">
                            <span>
                              You get: {converted}
                            </span>
                          </div>
                        </div>
                        <div className="form-group">
                          <button
                            onClick={this.convert}
                            className="cmn-btn"
                            id="convertToCrypto"
                          >
                            Convert
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-second">
                      <div className="address">
                        <h5>CASHOUT</h5>
                        {error && (
                          <div className="error">{error}</div>
                        )}
                        <div className="form-group">
                          <label className="small" htmlFor="cashOutCrypto">
                            Select cryptocurrency
                          </label>
                          <select
                            className="form-control"
                            name="cashOutCrypto"
                            id="cashOutCrypto"
                            value={this.state.cashOutCrypto}
                            onChange={this.onChange}
                          >
                            <option value="">SELECT ONE</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                            <option value="BCH">BCH</option>
                            <option value="LTC">LTC</option>
                            <option value="DASH">DASH</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="small" htmlFor="cashOutAmount">
                            Enter Amount
                          </label>
                          <input
                            type="cashOutAmount"
                            className="form-control"
                            name="cashOutAmount"
                            aria-describedby="cryptoAddress"
                            placeholder="Enter Amount"
                            value={this.state.cashOutAmount}
                            onChange={this.onChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="small" htmlFor="cashOutAddress">
                            Address.
                          </label>
                          <input
                            type="cashOutAddress"
                            className="form-control"
                            name="cashOutAddress"
                            aria-describedby="cryptoAddress"
                            placeholder="Enter Address"
                            value={this.state.cashOutAddress}
                            onChange={this.onChange}
                          />
                        </div>
                        <div className="form-group">
                          <button
                            id="withdraw"
                            onClick={this.cashOut}
                            className="cmn-btn"
                          >
                            Withdraw
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- 2nd --> */}
                <div className="tab-pane fade" id="ipsum" role="tabpanel">
                  <div className="history">
                    <h5>SITE HISTORY</h5>
                    <div className="history-list">
                      <p>Pocker</p>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SITES</th>
                            <th>USERNAME</th>
                            <th>BONUS</th>
                            <th>RAKEBACK 1</th>
                          </tr>
                        </thead>
                        <tbody>{this.pokers()}</tbody>
                      </table>
                    </div>

                    <div className="history-list">
                      <p>Sports</p>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SITES</th>
                            <th>USERNAME</th>
                            <th>BETBACK</th>
                            <th>LOSS BACK</th>
                          </tr>
                        </thead>
                        <tbody>{this.sports()}</tbody>
                      </table>
                    </div>

                    <div className="history-list">
                      <p>Trading</p>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SITES</th>
                            <th>USERNAME</th>
                            <th>FREE REBATE</th>
                          </tr>
                        </thead>
                        <tbody>{this.tradings()}</tbody>
                      </table>
                    </div>

                    <div className="history-list">
                      <p>Tools</p>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>SITES</th>
                            <th>USERNAME</th>
                            <th>REBATE (%)</th>
                            <th>REWARDS</th>
                          </tr>
                        </thead>
                        <tbody>{this.tools()}</tbody>
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
                            <th>#</th>
                            <th>USERNAME</th>
                            <th>DATE</th>
                            <th>REFERENCE</th>
                            <th>TYPE</th>
                            <th>AMOUNT</th>
                            <th>VALUE</th>
                          </tr>
                        </thead>
                        <tbody>{this.histories()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Change password Modal */}
        <div className="modal fade" id="changePass" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Change Password</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {
                  passwordError && (
                    <span className="error" >{passwordError}</span>
                  )
                }
                <div className="form-group">
                  <label className="small" htmlFor="currentPass">
                    Current Password
                  </label>
                  <input
                    type="cashOutAddress"
                    className="form-control"
                    name="currentPass"
                    aria-describedby="cryptoAddress"
                    placeholder="Enter Old password"
                    value={this.state.currentPass}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label className="small" htmlFor="newPass">
                    New Password
                  </label>
                  <input
                    type="cashOutAddress"
                    className="form-control"
                    name="newPass"
                    aria-describedby="cryptoAddress"
                    placeholder="Enter New Password"
                    value={this.state.newPass}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label className="small" htmlFor="newPassConfirm">
                    Repeat New Password
                  </label>
                  <input
                    type="cashOutAddress"
                    className="form-control"
                    name="newPassConfirm"
                    aria-describedby="cryptoAddress"
                    placeholder="Confirm password"
                    value={this.state.newPassConfirm}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.changePassword}>Save changes</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* 2fa Modal es */}
        <div className="modal fade" id="2fa" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Two-Factor authentication</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {
                  this.state.qrError && (
                    <span className="error" >{this.state.qrError}</span>
                  )
                }
                <div className="form-group">
                  <button
                    className="btn btn-primary"
                    onClick={this.generateQR}
                  >
                    Generate QR image
                  </button>
                </div>

                {this.state.stage2 && (
                  <div>
                    <p>Please enter this code <strong>{this.state.secretToken}</strong> on google authenticator and input the generated token below</p>
                    <p>-- OR --</p>
                    <p>Scan this QR image using google authenticator and input the generated token below.</p>
                    <div>
                      <img src={this.state.qrImg} alt="QR image" />
                    </div>
                    <div className="form-group">
                      <label className="small" htmlFor="newPass">
                        Token
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="token"
                        aria-describedby="token"
                        placeholder="Enter Token"
                        value={this.state.token}
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {this.state.stage2 && (
                  <button type="button" className="btn btn-primary" onClick={this.confirmToken}>Enable 2fa</button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </section >
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

// Dashboard.propTypes = {
//   auth: PropTypes.shape({
//     isAuthenticated: PropTypes.bool.isRequired,
//     user: PropTypes.shape({}).isRequired
//   }).isRequired,
//   logoutAction: PropTypes.func.isRequired
// };

export default connect(mapStateToProps, {
  getSingleUser
})(Dashboard);
