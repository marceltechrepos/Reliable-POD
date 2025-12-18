import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '../components/Breadcrumbs';
import MenuItem from '@mui/material/MenuItem';
import BasicTabs from '../components/PrintareaAndVariantTabs';
import { Link } from 'react-router-dom';

function ProductBase() {
    const [provider, setProvider] = useState('');
    const fulfillmentHandler = (event) => {
        setProvider(event.target.value);
    };

    return (
        <>
            <div className='w-5/6 bg-slate-100 pt-10 px-10 pb-5'>
                <Breadcrumbs />
                <div className='product-fields w-1/2 bg-white mt-5 p-4 rounded-xl border-s-5 border-ocean border-solid'>
                    <h2 className='text-2xl font-bold text-black mb-10'>Basic information</h2>
                    <div className="mb-5">
                        <TextField
                            id="productTitle"
                            className='w-full'
                            label="Product Title"
                            size='small'
                        />
                    </div>
                    <div className="mb-5">
                        <TextField
                            id="internalName"
                            className='w-full'
                            label="Internal Name"
                            size='small'
                        />
                    </div>
                    <div className="mb-5">
                        <FormControl fullWidth size="small">
                            <InputLabel id="fulfillmentProvider-label">
                                Fulfillment Provider
                            </InputLabel>
                            <Select
                                labelId="fulfillmentProvider-label"
                                id="fulfillmentProvider"
                                value={provider}
                                label="Fulfillment Provider"
                                onChange={fulfillmentHandler}
                            >
                                <MenuItem value="">
                                    <em>Choose an option</em>
                                </MenuItem>
                                <MenuItem value="print-on-demand-app">
                                    Print-On-Demand.App
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <div className='text-sm text-ocean underline text-end'><Link to="/admin/provider">Add Provider</Link > </div>
                    </div>
                    <div className="mb-5">
                        <TextField
                            type='number'
                            id="fulfillmentCatalog"
                            className='w-full'
                            label="Fulfillment catalog ID"
                            size='small'
                        />
                    </div>
                    <div className="mb-5">
                        <TextField
                            id="outlined-multiline-static"
                            label="Your Message"
                            className='w-full'
                            multiline
                            rows={4}
                        />
                    </div>
                    <div className='save-btn'>
                        <button type='button' className='text-sm font-normal shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4 cursor-pointer'>Save</button>
                    </div>
                </div>
                <BasicTabs />
            </div>
        </>
    );
}

export default ProductBase;