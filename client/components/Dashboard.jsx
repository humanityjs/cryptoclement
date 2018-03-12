import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import logoutAction from '../actions/logoutAction';
import { getSingleUser, deleteStore } from '../actions/userAction';

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
      user: this.props.auth.user,
      details: this.props.user,
      loading: true
    };
    this.logOut = this.logOut.bind(this);
  }

  /**
   * Loads user's details on load
   * @method componentDidMount
   * @returns {void}
   * @memberOf Dashboard
   */
  componentDidMount() {
    this.props.getSingleUser(this.state.user.uuid);
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
    const { contractSum, earningsTotal, user } = this.state.details;
    const { loading } = this.state;
    const { contracts } = user;
    const numOfContracts = contracts.length || 0;

    const trimamount = amount =>
      amount
        .toString()
        .split('')
        .slice(0, 12)
        .join('');

    let AllContracts; //
    if (loading) {
      AllContracts = <p>Loading.....</p>;
    } else if (!loading && contracts.length <= 0) {
      AllContracts = <p>You do not have any contract yet. Please buy one!</p>;
    } else {
      AllContracts = contracts.map((contract, i) => (
        <li className={i === 0 ? 'uk-open' : ''} key={i}>
          <a className="uk-accordion-title" href="#">
            #{i + 1} CONTRACT
          </a>
          <div className="uk-accordion-content">
            <p className="acc-header">TH/S VALUE: {contract.value}</p>
            <p>Here are the latest transaction relating to this contract</p>
            <table className="uk-table uk-table-divider">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>DATE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {contract.earnings.length > 0 ? (
                  contract.earnings.reverse().map((earning, j) => (
                    <tr key={j}>
                      <td>{j + 1}</td>
                      <td>{moment(earning.eDate).format('DD-MM-YYYY')}</td>
                      <td>{earning.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      You do not have any earnings yet. Your daily earnings will
                      show here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </li>
      ));
    }
    return (
      <div>
        <div className="uk-container uk-container-small uk-position-relative p0">
          <section id="1" className="b-main">
            <div className="uk-section uk-section-default">
              <div className="uk-container">
                <h3 className="ml-15 bb">ACCOUNT OVERVIEW</h3>

                <div
                  className="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m uk-grid-match"
                  uk-grid={true.toString()}
                >
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-default uk-card-body">
                      <div>
                        <h3 className="uk-card-title">CONTRACTS</h3>
                        <p>{numOfContracts}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-primary uk-card-body">
                      <div>
                        <h3 className="uk-card-title">HASHRATE (Th/s)</h3>
                        <p>{contractSum} </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-flex uk-flex-middle uk-flex-center uk-card-secondary uk-card-body">
                      <div>
                        <h3 className="uk-card-title">EARNINGS (BTC)</h3>
                        <p>{trimamount(earningsTotal)}</p>
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
                <h3 className="bbw">CONTRACT DETAILS</h3>
                <div className="uk-container uk-container-small uk-position-relative p0">
                  <ul uk-accordion={true.toString()}>{AllContracts}</ul>
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

Dashboard.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape({}).isRequired
  }).isRequired,
  logoutAction: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  logoutAction,
  getSingleUser,
  deleteStore
})(Dashboard);
