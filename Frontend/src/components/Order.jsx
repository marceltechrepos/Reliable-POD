import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Breadcrumbs from './Breadcrumbs'

function Order() {
  return (
    <>
        <Topbar />
        <div className='flex custom-height bg-slate-100'>
            <Sidebar />
            <div className='w-5/6 p-5'>
              <Breadcrumbs />
            </div>
        </div>
    </>
  )
}

export default Order