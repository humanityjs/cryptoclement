import React, { Component } from 'react'; //
import axios from 'axios';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios.get('/api/users').then(
      ({ data }) => {
        this.setState({
          users: data.users.rows
        });
      },
      ({ response }) => {
        console.log(response);
      }
    );
  }

  render() {
    const { users } = this.state;
    return (
      <div>
        <div className="uk-container uk-container-small uk-position-relative p0">
          <section>
            <div className="uk-section uk-section-default">
              <div className="uk-container">
                <h3 className="ml-15 bb">ALL USERS</h3>
                <div>
                  <table className="uk-table uk-table-divider">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>USERNAME</th>
                        <th>FIRST NAME</th>
                        <th>LAST NAME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.fname}</td>
                            <td>{user.lname}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No users to display.</td>
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

export default Users;
