import React from 'react'
import Layout from '../../components/Layout'
import AdminMenu from '../AdminMenu'
import { useAuth } from '../../context/auth'
const AdminDashboard = () => {
    const [auth]=useAuth()
  return (
    <Layout>
        <div className='row'>
            <div className='col-md-3'>
                <AdminMenu/>
            </div>
            <div className="col-md-9">
                <div className='card'>
                    <h1>Admin Name:{auth?.user?.name}</h1>
                </div>
            </div>
        </div> 
    </Layout>
  )
}

export default AdminDashboard