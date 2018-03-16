import React from 'react';

const Single = () => (
  <section id="main" className="sec-pad">
    <div className="container">
      <div className="row">
        <div className="col-md-9" style={{ borderRight: '1px solid #000080' }}>
          <div className="single-post">
            <div className="post-thumbnail">
              <img src="images/post-thumbnail-1.jpg" />
            </div>
            <div className="post-content">
              <h4 className="post-title"><a href="">What a Sick Beat</a></h4>
              <h6 className="date">12 February 2018 <span style={{ float: 'right' }}><i className="fa fa-comments"> 20</i></span></h6>
              <p>The sickest beat I ever took happened in pot limit omaha. I had AAQX suited and raised before the flop. My opponent called my raise, much to my delight, because I was playing a very loose style.</p>
              <p>The flop came Ah Qh 3s. "OMG!" I thought to myself, "He must have hit that flop in some way." Sure enough, he tanked for a few seconds and called my continuation bet. </p>
            </div>
            <div className="share-btn"><h4>Share This</h4>
              <ul>
                <li><a href=""><i className="fa fa-facebook" /></a></li>
                <li><a href=""><i className="fa fa-twitter" /></a></li>
                <li><a href=""><i className="fa fa-linkedin" /></a></li>
                <li><a href=""><i className="fa fa-instagram" /></a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="blog-sidebar">
            <div className="archive">
              <h3 className="sidebar-title">
                Go to  Archive
              </h3>
              <input type="date" name="bday" min="2000-01-02" />
            </div>
            {/* <!-- Recent Post --> */}
            <div className="recent-post">
              <h3 className="sidebar-title">
                Recent Posts
              </h3>
              <ul>
                <li><a href="">Hello World</a></li>
                <li><a href="">What is lorem Ipsum ? </a></li>
                <li><a href="">Why do we use it?</a></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);

export default Single;
