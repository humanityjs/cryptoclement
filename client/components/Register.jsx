import React from 'react';

const Register = () => (
  <section id="main">
    <div className="container text-center">
      <div className="row brand">
        <div className="text-center login-form" style={{ margin: '0 auto', marginTop: '50px' }}>
          <form action="" method="">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Enter Your Email Address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            <div className="form-check">
              <label className="form-check-label">
                <input className="form-check-input" type="checkbox" /> I agree the Terms of Service.
              </label>
            </div>
            <div className="text-center but-div">
              <button className="cmn-btn">Create Account</button>
            </div>
          </form>
          <ul className="reg-menu text-center">
            <li>
              <a href="/contact">Contact us</a>
            </li>
            <li>
              <a href="/tos">Help</a>
            </li>
            <li>
              <a href="/forgot">Forgot Password ? </a>
            </li>
          </ul>
          <div className="text-center">
            <p>Already Member?</p>
            <div className="but-div">
              <a href="/login">
                <button className="cmn-btn ">Login Now</button>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  </section>
);

export default Register;
