import React from 'react';

const Login = () => (
  <section id="main">
    <div className="container text-center">
      <div className="row brand">
        <div className="text-center login-form" style={{ margin: '0 auto', marginTop: '50px' }}>
          <form action="" method="">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <div className="text-center">
              <button className="cmn-btn">Submit</button>
            </div>
          </form>
          <ul className="reg-menu text-center">
            <li><a href="/contact">Contact us</a></li>
            <li><a href="/tos">Help</a></li>
            <li><a href="/forgot-pas">Forgote Password ? </a></li>
          </ul>
          <p className="text-center">New User?</p>
          <div className="text-center but-div">

            <a href="/register"><button className="cmn-btn">Register Now</button></a>
          </div>

        </div>

      </div>
    </div>
  </section>
);

export default Login;
