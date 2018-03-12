import React, { Component } from 'react'; //
import axios from 'axios';
import moment from 'moment';

class Earnings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earnings: []
    };
  }

  componentDidMount() {
    axios.get('/api/earnings/mine').then(
      ({ data }) => {
        this.setState({
          earnings: data.mines.rows
        });
      },
      ({ response }) => {
        console.log(response);
      }
    );
  }

  render() {
    const { earnings } = this.state;
    return (
      <div>
        <div className="uk-container uk-container-small uk-position-relative p0">
          <section>
            <div className="uk-section uk-section-default">
              <div className="uk-container">
                <h3 className="ml-15 bb">ALL EARNINGS</h3>
                <div>
                  <table className="uk-table uk-table-divider">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>HASHRATE</th>
                        <th>VALUE</th>
                        <th>EARNING DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.length > 0 ? (
                        earnings.map((earning, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{earning.th}</td>
                            <td>{earning.earnings}</td>
                            <td>
                              {moment(earning.mineDate).format('DD-MM-YYYY')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No earnings to display.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Earnings;
