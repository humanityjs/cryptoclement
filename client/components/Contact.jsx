import React from 'react';

const Contact = () => (
  <section id="main" className="sec-pad">
    <div className="container">
      <div className="row">
        <div className="col-md-2" />
        <div className="col-md-8">
          <div className="contact-form">
            <h2 className="contact-title">
              Contact Us
            </h2>
            <div className="contac-info">
              <h4>Email</h4>
              <h5>admin@gmail.com</h5>
            </div>
            <h2>
              Or Use This Form
            </h2>
            <form action="" method="">
              <div className="full-input">
                <input type="email" name="email" placeholder="Enter Your Email" />
              </div>
              <div className="full-input">
                <input type="text" name="subject" placeholder="Enter Your Subject" />
              </div>
              <div className="full-input">
                <textarea name="message" placeholder="Enter Your Message" />
              </div>

              {/* <!-- Replace data-sitekey with your own one, generated at https://www.google.com/recaptcha/admin --> */}
              <div className="g-recaptcha" data-sitekey="6LcbkEQUAAAAAL8Q8Tl7r_QOqtr5O5UtywpYvqXG" />

              <button type="Submit" name="send" className="cmn-btn">Send Message</button>
            </form>
          </div>
        </div>
        <div className="col-md-2" />
      </div>
    </div>
  </section>
);

export default Contact;
