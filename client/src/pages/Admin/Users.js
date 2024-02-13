import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/Routes/AdminRoute';
import AdminMenu from '../AdminMenu';
import axios from 'axios';

const Users = () => {
  const [data, setData] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get('/api/v1/auth/allusers');
      // Assuming the response is an array or an object with a property containing an array
      setData(response.data); // Set data to the array within the response
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
            
            {data?.map((j) => (
              <div className="border shadow" key={j.email}>
                <table className="table">
                  <tbody>
                    <tr>
                      <td><b>Name:</b>{j?.name}</td>
                      <td><b>Email:</b>{j?.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
