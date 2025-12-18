import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Breadcrumbs from '../components/Breadcrumbs';
import MenuItem from '@mui/material/MenuItem';
import BasicTabs from '../components/PrintareaAndVariantTabs';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function ProductBase() {
  const [provider, setProvider] = useState('');

  const [providers, setProviders] = useState([
    { label: 'Print-On-Demand.App', value: 'print-on-demand-app' }
  ]);

  const [open, setOpen] = useState(false);
  const [newProvider, setNewProvider] = useState('');

  const fulfillmentHandler = (event) => {
    setProvider(event.target.value);
  };

  const addProviderHandler = () => {
    if (!newProvider.trim()) return;

    const value = newProvider.toLowerCase().replace(/\s+/g, '-');

    setProviders(prev => [...prev, { label: newProvider, value }]);
    setProvider(value);
    setNewProvider('');
    setOpen(false);
  };

  return (
    <>
      <div className="flex w-full bg-slate-100">
        <div className="w-full p-10">
          <Breadcrumbs />

          <div className="product-fields w-1/2 bg-white mt-5 p-4 rounded-xl border-s-5 border-ocean border-solid">
            <h2 className="text-2xl font-bold text-black mb-10">
              Basic information
            </h2>

            {/* Product Title */}
            <div className="mb-5">
              <TextField
                label="Product Title"
                className="w-full"
                size="small"
              />
            </div>

            {/* Internal Name */}
            <div className="mb-5">
              <TextField
                label="Internal Name"
                className="w-full"
                size="small"
              />
            </div>

            {/* Fulfillment Provider */}
            <div className="mb-5">
              <FormControl fullWidth size="small">
                <InputLabel id="fulfillmentProvider-label">
                  Fulfillment Provider
                </InputLabel>
                <Select
                  labelId="fulfillmentProvider-label"
                  value={provider}
                  label="Fulfillment Provider"
                  onChange={fulfillmentHandler}
                >
                  <MenuItem value="">
                    <em>Choose an option</em>
                  </MenuItem>

                  {providers.map((p, index) => (
                    <MenuItem key={index} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Add Provider */}
              <div
                onClick={() => setOpen(true)}
                className="text-sm text-ocean underline text-end cursor-pointer mt-1"
              >
                Add Provider
              </div>
            </div>

            {/* Fulfillment catalog ID */}
            <div className="mb-5">
              <TextField
                type="number"
                label="Fulfillment catalog ID"
                className="w-full"
                size="small"
              />
            </div>

            {/* Message */}
            <div className="mb-5">
              <TextField
                label="Your Message"
                className="w-full"
                multiline
                rows={4}
              />
            </div>

            {/* Save Button */}
            <div className="save-btn">
              <button className="text-sm shadow-lg bg-ocean hover:bg-hoverTiger rounded-md text-white py-2 px-4">
                Save
              </button>
            </div>
          </div>

          <BasicTabs />
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Add Provider</h2>

          <TextField
            label="Provider Name"
            fullWidth
            size="small"
            value={newProvider}
            onChange={(e) => setNewProvider(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm border rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={addProviderHandler}
              className="px-4 py-2 text-sm bg-ocean text-white rounded-md cursor-pointer"
            >
              Add Provider
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default ProductBase;
