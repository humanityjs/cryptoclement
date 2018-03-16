import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert2';
import { addSite } from '../actions/userAction';

class Betonline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      error: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e, type) {
    e.preventDefault();
    this.setState({
      error: ''
    });
    if (type === 'new') {
      const filter = /^[\w\-.+]+@[a-zA-Z0-9.-]+\.[a-zA-z0-9]{2,4}$/;
      if (!this.state.username || !this.state.email) {
        this.setState({
          error: 'Please fill all fields'
        });
        return;
      }
      if (!filter.test(this.state.email)) {
        this.setState({
          error: 'Please input a valid email address'
        });
        return;
      }
      this.props
        .addSite({
          email: this.state.email,
          username: this.state.username,
          siteName: this.props.page.subPage,
          siteType: this.props.page.currentPage
        })
        .then((res) => {
          if (res) {
            swal({
              title: 'Success',
              html: 'Site added successfully!',
              type: 'success',
              allowOutsideClick: false
            });
          } else {
            swal({
              title: 'Error',
              html: 'You caanot add the same site twice!',
              type: 'error',
              allowOutsideClick: false
            });
          }
        });
    } else {
      if (!this.state.username) {
        this.setState({
          error: 'Please enter your username'
        });
        return;
      }
      this.props
        .addSite({
          email: this.props.auth.user.email,
          username: this.state.username,
          siteName: this.props.page.subPage,
          siteType: this.props.page.currentPage
        })
        .then((res) => {
          if (res) {
            swal({
              title: 'Success',
              html: 'Site added successfully!',
              type: 'success',
              allowOutsideClick: false
            });
          } else {
            swal({
              title: 'Error',
              html: 'You caanot add the same site twice!',
              type: 'error',
              allowOutsideClick: false
            });
          }
        });
    }
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    const { error } = this.state;
    return (
      <section id="main" className="sec-pad poker">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <a href="">
                <img src="images/04.png" />
              </a>
            </div>
            <div className="col-md-7">
              <ul>
                <li>27% Flat Rakeback (Paid By Poker Room)</li>
                <li>7.5% Rakeback Paid By Us</li>
              </ul>
            </div>
          </div>
          <div className="row text-left sec-pad">
            <div className="col-md-4">
              <h4>Step 1 </h4>
              <b>Download</b>
              <br />
              <a href="">
                <img
                  src="images/TabLinksIcon_01.png"
                  height="80"
                  width="auto"
                />
              </a>
            </div>
            <div className="col-md-4">
              <h4>Step 2 </h4>
              <img
                src="images/Instructional_Guide.jpg"
                width="320px"
                height="auto"
              />
            </div>
            <div className="col-md-4 step-3">
              <h4>Step 3 </h4>
              <p>Verify Your Betonline Username </p>
              {error && (
                <div className="error">{error}</div>
              )}
              <input
                id="signupUsername"
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
              />
              <br />
              {!isAuthenticated ? (
                <div>
                  <p>Join BTC Grinders</p>
                  <input
                    id="signupEmail"
                    type="text"
                    name="email"
                    placeholder="Enter Your Email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  <br />
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="form-check-input" type="checkbox" />I
                      agree the Terms of Service.
                    </label>
                  </div>
                  <div className="but-div">
                    <button
                      id="signupButton"
                      onClick={e => this.onSubmit(e, 'new')}
                      className="cmn-btn"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="but-div">
                    <button
                      id="signupButton"
                      onClick={e => this.onSubmit(e, 'old')}
                      className="cmn-btn"
                    >
                      Add site
                    </button>
                  </div>
                )}
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
  page: state.pageInfo
});

export default connect(mapStateToProps, { addSite })(Betonline);
