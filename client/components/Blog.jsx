import React from 'react';

const Blog = () => (
  <section id="main" className="sec-pad">
    <div className="container">
      <div className="row">
        <div className="col-md-9" style={{ borderRight: '1px solid #000080' }}>
          <div className="post-list">
            <div className="post-thumbnail">
              <img src="images/post-thumbnail-1.jpg" />
            </div>
            <div className="post-content">
              <h4 className="post-title"><a href="/single">The Sickest Beat Ever</a></h4>
              <h6 className="date">13 February 2017 <span style={{ float: 'right' }}><i className="fa fa-comments"> 20</i></span></h6>
              <p>The sickest beat I ever took happened in pot limit omaha. I had AAQX suited and raised before the flop. My opponent called my raise, much to my delight, because I was playing a very loose style.</p>
              <p>The flop came Ah Qh 3s. "OMG!" I thought to myself, "He must have hit that flop in some way." Sure enough, he tanked for a few seconds and called my continuation bet.  <span className="read-more"><a href="single.html">Read More</a></span></p>
            </div>
          </div>
          <div className="post-list">
            <div className="post-thumbnail">
              <img src="images/post-thumbnail-2.jpg" />
            </div>
            <div className="post-content">
              <h4 className="post-title"><a href="/single">Why do we use it?</a></h4>
              <h6 className="date"><i>28 january 2018</i>  <span style={{ float: 'right' }}><i className="fa fa-comments"> 20</i></span></h6>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sincea the 1500s, when an unknown printer took a galley of type and scrambled <span className="read-more"><a href="single.html">Read More</a></span></p>
            </div>
          </div>
          <div className="post-list">
            <div className="post-thumbnail">
              <img src="images/post-thumbnail-1.jpg" />
            </div>
            <div className="post-content">
              <h4 className="post-title"><a href="/single">What is Lorem Ipsum?</a></h4>
              <h6 className="date">28 january 2018 <span style={{ float: 'right' }}><i className="fa fa-comments"> 20</i></span></h6>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sincea the 1500s, when an unknown printer took a galley of type and scrambled <span className="read-more"><a href="single.html">Read More</a></span></p>
            </div>
          </div>
          <div className="pagi">
            <ul>
              <li className="active"><a href="">1</a></li>
              <li><a href="">2</a></li>
              <li><a href="">3</a></li>
            </ul>
          </div>

        </div>
        <div className="col-md-3">
          <div className="blog-sidebar">
            <div className="archive">
              <h3 className="sidebar-title">
                Go to  Archive
              </h3>
              <input type="date" name="bday" min="2000-01-02" />
              {/* <!-- <div class="month">
                        <ul>
                          <li class="prev">&#10094;</li>
                          <li class="next">&#10095;</li>
                          <li>
                            August<br />
                              <span style="font-size:18px">2017</span>
                  </li>
                </ul>
              </div>

                        <ul class="weekdays">
                          <li>Mo</li>
                          <li>Tu</li>
                          <li>We</li>
                          <li>Th</li>
                          <li>Fr</li>
                          <li>Sa</li>
                          <li>Su</li>
                        </ul>

                        <ul class="days">
                          <li>1</li>
                          <li>2</li>
                          <li>3</li>
                          <li>4</li>
                          <li>5</li>
                          <li>6</li>
                          <li>7</li>
                          <li>8</li>
                          <li>9</li>
                          <li><span class="active">10</span></li>
                          <li>11</li>
                          <li>12</li>
                          <li>13</li>
                          <li>14</li>
                          <li>15</li>
                          <li>16</li>
                          <li>17</li>
                          <li>18</li>
                          <li>19</li>
                          <li>20</li>
                          <li>21</li>
                          <li>22</li>
                          <li>23</li>
                          <li>24</li>
                          <li>25</li>
                          <li>26</li>
                          <li>27</li>
                          <li>28</li>
                          <li>29</li>
                          <li>30</li>
                          <li>31</li>
                        </ul> --> */}
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

export default Blog;
