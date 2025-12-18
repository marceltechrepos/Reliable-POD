import React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import BasicTable from './BasicTable'

function ProductVariant() {
  return (
    <div className='variant-container bg-white border-s-5 border-ocean border-solid mt-5 p-4 rounded-xl'>
        <div className='variant-header flex items-center justify-end'>
            {/* <h2 class="text-2xl font-bold text-black mb-10">Variant</h2> */}
            <div className='flex gap-2'>
                <button type='button' className='flex gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'>
                    Import
                </button>
                <button type='button' className='flex gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'>
                    Export
                </button>
                <button type='button' className='flex gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                    </svg>
                    Download Template
                </button>
            </div>
        </div>
        <div className='mt-5'>
            <div className='flex justify-between gap-2 mb-2'>
                <div className='flex gap-2'>
                    <button type='button' className='flex items-center gap-2 text-sm font-normal shadow-lg rounded-md border border-red-600 text-red-600 hover:bg-red-800 hover:text-white py-1 px-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="cursor-pointer" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path></svg>
                        Delete Selected
                    </button>
                    <button type='button' className='flex items-center gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter-left" viewBox="0 0 16 16">
                            <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        Display Setting
                    </button>
                    <FormControlLabel control={<Switch />} label="Custom Variant's Printarea" className='text-sm' />
                </div>
                <button type='button' className='flex items-center gap-2 text-sm font-normal shadow-lg bg-tiger hover:bg-hoverTiger rounded-md text-white py-2 px-4 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-plus" viewBox="0 0 16 16">
                        <path fill='#fff' d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                    New Variant
                </button>
            </div>
            <BasicTable />
        </div>
    </div>
  )
}

export default ProductVariant