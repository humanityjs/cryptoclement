import React, { Component } from 'react'; //
import axios from 'axios';
import moment from 'moment';

class Contracts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: []
    };
  }

  componentDidMount() {
    axios.get('/api/contracts').then(
      ({ data }) => {
        this.setState({
          contracts: data.contracts.rows
        });
      },
      ({ response }) => {
        console.log(response);
      }
    );
  }

  render() {
    const { contracts } = this.state;
    return (
      <div>
        <div className="uk-container uk-container-small uk-position-relative p0">
          <section>
            <div className="uk-section uk-section-default">
              <div className="uk-container">
                <h3 className="ml-15 bb">ALL CONTRACTS</h3>
                <div>
                  <table className="uk-table uk-table-divider">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>USERNAME</th>
                        <th>START DATE</th>
                        <th>END DATE</th>
                        <th>VALUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.length > 0 ? (
                        contracts.map((contract, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{contract.user.username}</td>
                            <td>
                              {moment(contract.startDate).format('DD-MM-YYYY')}
                            </td>
                            <td>
                              {moment(contract.endDate).format('DD-MM-YYYY')}
                            </td>
                            <td>{contract.value}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No contracts to display.</td>
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

export default Contracts;
