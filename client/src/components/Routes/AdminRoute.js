import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import React from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get('/api/v1/auth/admin-auth');
      if (res.data.ok) {
        console.log('OK');
        setOk(true);
      } else {
        console.log('NOT OK');
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);
  return ok ? <Outlet /> : <Spinner />;
};

export default AdminRoute;
