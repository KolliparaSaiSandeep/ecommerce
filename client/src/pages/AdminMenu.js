import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminMenu = () => {
  return (
    <>
      <div className="list-group">
        <h4>Admin control</h4>
        <NavLink
          to="/dashboard/admin/create-category"
          className="list-group-item "
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-product"
          className="list-group-item"
        >
          Create Product
        </NavLink>
        <NavLink to="/dashboard/admin/users" className="list-group-item">
          Users
        </NavLink>
        <NavLink to="/dashboard/admin/orders" className="list-group-item">
          Orders
        </NavLink>
      </div>
    </>
  );
};

export default AdminMenu;
