import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function Dashboard() {
  return (
    <>
        <Topbar />
        <div className='flex custom-height bg-slate-100'>
            <Sidebar />
            <div className='w-5/6 p-5'>Dashboard</div>
        </div>
    </>
  )
}

export default Dashboard