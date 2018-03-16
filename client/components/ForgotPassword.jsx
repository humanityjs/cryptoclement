import React from 'react';

const ForgotPassword = () => (
  <section id="main" className="sec-pad">
    <div className="container">
      <div className="row text-center">
        <div style={{ width: '40%', margin: '0 auto' }}>
          <input type="email" name="email" placeholder="Enter Your User Email" />
          <button type="Submit" name="" className="cmn-btn">Reset</button>
        </div>
      </div>
    </div>
  </section>
);

export default ForgotPassword;
