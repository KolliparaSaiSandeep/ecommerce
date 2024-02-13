import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Spinner = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);
    count == 0 && navigate('/login', { state: location.pathname });
    return () => clearInterval(interval);
  }, [count, navigate,location]);
  return (
    <div
      className="d-flex justify-content-center align"
      style={{ height: '100vh' }}
    >
      <h1 className="Text-center">Redirecting in {count} second</h1>
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
