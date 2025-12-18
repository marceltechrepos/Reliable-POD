import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import BasicTable from './BasicTable';

function ProductVariant() {
  // State to control form visibility
  const [showForm, setShowForm] = useState(false);
  const [deleteSelectedTrigger, setDeleteSelectedTrigger] = useState(false);
  const [isCustomPrintArea, setIsCustomPrintArea] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [printAreaData, setPrintAreaData] = useState({
    key: '',
    displayName: '',
    width: '',
    height: ''
  });

  // Generate TIB function
  const generateTIB = () => {
    const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `PA-${randomPart}`;
  };

  // Handle New Variant button click
  const handleNewVariantClick = () => {
    setShowForm(true);
  };

  // Handle Delete Selected button click
  const handleDeleteSelectedClick = () => {
    setDeleteSelectedTrigger(prev => !prev);
  };

  // Handle form close from BasicTable
  const handleFormClose = () => {
    setShowForm(false);
  };

  // Handle switch change
  const handleSwitchChange = (event) => {
    setIsCustomPrintArea(event.target.checked);
  };

  // Handle modal open
  const handleModalOpen = () => {
    // Auto-generate TIB when opening modal
    const generatedTIB = generateTIB();
    setPrintAreaData(prev => ({
      ...prev,
      tib: generatedTIB
    }));
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setPrintAreaData({
      key: '',
      displayName: '',
      width: '',
      height: ''
    });
  };

  // Handle print area input change
  const handlePrintAreaChange = (event) => {
    const { name, value } = event.target;
    setPrintAreaData({
      ...printAreaData,
      [name]: value,
    });
  };

  // Handle print area form submit
  const handlePrintAreaSubmit = () => {
    // Basic validation
    if (!printAreaData.key || !printAreaData.displayName || !printAreaData.width || !printAreaData.height) {
      alert('Please fill all fields!');
      return;
    }

    // Here you would typically save the print area data
    // For example: send to API, update state, etc.
    const newPrintArea = {
      id: Date.now(), // You might want to use UUID here
      tib: printAreaData.tib || generateTIB(),
      key: printAreaData.key,
      displayName: printAreaData.displayName,
      width: printAreaData.width,
      height: printAreaData.height,
      createdAt: new Date().toISOString(),
    };

    console.log('New Print Area Added:', newPrintArea);
    
    // Show success message
    alert('Print area added successfully!');
    
    // You can add logic here to update your print areas list
    // For example: setPrintAreas([...printAreas, newPrintArea]);
    
    handleModalClose();
  };

  return (
    <div className='variant-container bg-white border-s-5 border-ocean border-solid mt-5 p-4 rounded-xl'>
      <div className='variant-header flex items-center justify-end'>
        <div className='flex gap-2'>
          <button
            type='button'
            className='flex gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'
          >
            Import
          </button>
          <button
            type='button'
            className='flex gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'
          >
            Export
          </button>
          <button
            type='button'
            className='flex gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-download'
              viewBox='0 0 16 16'
            >
              <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5' />
              <path d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z' />
            </svg>
            Download Template
          </button>
        </div>
      </div>
      <div className='mt-5'>
        <div className='flex justify-between gap-2 mb-2'>
          <div className='flex gap-2 items-center'>
            <button
              type='button'
              className='flex items-center gap-2 text-sm font-normal shadow-lg rounded-md border border-red-600 text-red-600 hover:bg-red-800 hover:text-white py-1 px-2 cursor-pointer'
              onClick={handleDeleteSelectedClick}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='cursor-pointer'
                viewBox='0 0 16 16'
              >
                <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z'></path>
                <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z'></path>
              </svg>
              Delete Selected
            </button>
            <button
              type='button'
              className='flex items-center gap-2 text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-filter-left'
                viewBox='0 0 16 16'
              >
                <path d='M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5' />
              </svg>
              Display Setting
            </button>
            <FormControlLabel
              control={
                <Switch
                  checked={isCustomPrintArea}
                  onChange={handleSwitchChange}
                  color='primary'
                />
              }
              label="Custom Variant's Printarea"
              className='text-sm'
            />
            
            {/* Add Button - Shows when switch is checked */}
            {isCustomPrintArea && (
              <Button
                variant='contained'
                size='small'
                onClick={handleModalOpen}
                sx={{
                  backgroundColor: '#3b6d92',
                  color:'#fff !important',
                  '&:hover': {
                    backgroundColor: '#2a4d6e',
                  },
                  ml: 2,
                }}
              >
                Add Print Area
              </Button>
            )}
          </div>
          <button
            type='button'
            className='flex items-center gap-2 text-sm font-normal shadow-lg bg-tiger hover:bg-hoverTiger rounded-md text-white py-2 px-4 cursor-pointer'
            onClick={handleNewVariantClick}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              fill='#fff'
              className='bi bi-plus'
              viewBox='0 0 16 16'
            >
              <path
                fill='#fff'
                d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4'
              />
            </svg>
            New Variant
          </button>
        </div>

        {/* Modal for Print Area */}
        <Dialog open={modalOpen} onClose={handleModalClose} maxWidth='sm' fullWidth>
          <DialogTitle>Add Custom Print Area</DialogTitle>
          <DialogContent>
            <div className='space-y-4 mt-2'>
              {/* TIB Field (Read-only, auto-generated) */}
              <TextField
                fullWidth
                label='TIB'
                value={printAreaData.tib || 'Will be auto-generated'}
                variant='outlined'
                size='small'
                InputProps={{
                  readOnly: true,
                }}
                helperText="Auto-generated unique identifier"
              />
              
              {/* Fulfill Key Field */}
              <TextField
                fullWidth
                label='Fulfill Key *'
                name='key'
                value={printAreaData.key}
                onChange={handlePrintAreaChange}
                variant='outlined'
                size='small'
                required
                placeholder='Enter Fulfill Key (e.g., Front, Back)'
              />
              
              {/* Display Name Field */}
              <TextField
                fullWidth
                label='Display Name *'
                name='displayName'
                value={printAreaData.displayName}
                onChange={handlePrintAreaChange}
                variant='outlined'
                size='small'
                required
                placeholder='Enter Display Name'
              />
              
              {/* Width and Height Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <TextField
                  label='Width (px) *'
                  name='width'
                  value={printAreaData.width}
                  onChange={handlePrintAreaChange}
                  variant='outlined'
                  size='small'
                  type='number'
                  required
                  placeholder='e.g., 1314'
                />
                <TextField
                  label='Height (px) *'
                  name='height'
                  value={printAreaData.height}
                  onChange={handlePrintAreaChange}
                  variant='outlined'
                  size='small'
                  type='number'
                  required
                  placeholder='e.g., 1314'
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color='secondary'>
              Cancel
            </Button>
            <Button
              onClick={handlePrintAreaSubmit}
              variant='contained'
              sx={{ 
                backgroundColor: '#3b6d92', 
                '&:hover': { 
                  backgroundColor: '#2a4d6e' 
                } 
              }}
            >
              Add Print Area
            </Button>
          </DialogActions>
        </Dialog>

        {/* Pass props to BasicTable */}
        <BasicTable
          showForm={showForm}
          onFormClose={handleFormClose}
          deleteSelectedTrigger={deleteSelectedTrigger}
        />
      </div>
    </div>
  );
}

export default ProductVariant;