
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


    // Show success message
    alert('Print area added successfully!');

    // You can add logic here to update your print areas list
    // For example: setPrintAreas([...printAreas, newPrintArea]);

    handleModalClose();
  };

  return (
    <div className='variant-container bg-white border-s-4 md:border-s-5 border-ocean border-solid mt-5 p-3 md:p-4 rounded-xl'>
      {/* Top Header Buttons - Mobile Responsive */}
      <div className='variant-header flex items-center justify-end mb-4'>
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            className='flex items-center gap-1 text-xs md:text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 md:px-3 cursor-pointer whitespace-nowrap'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='14'
              height='14'
              fill='currentColor'
              className='bi bi-upload hidden md:block'
              viewBox='0 0 16 16'
            >
              <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5' />
              <path d='M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z' />
            </svg>
            <span>Import</span>
          </button>
          <button
            type='button'
            className='flex items-center gap-1 text-xs md:text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 md:px-3 cursor-pointer whitespace-nowrap'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='14'
              height='14'
              fill='currentColor'
              className='bi bi-download hidden md:block'
              viewBox='0 0 16 16'
            >
              <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5' />
              <path d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z' />
            </svg>
            <span>Export</span>
          </button>
          <button
            type='button'
            className='flex items-center gap-1 text-xs md:text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 md:px-3 cursor-pointer whitespace-nowrap'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='14'
              height='14'
              fill='currentColor'
              className='bi bi-download'
              viewBox='0 0 16 16'
            >
              <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5' />
              <path d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z' />
            </svg>
            <span className='hidden md:inline'>Download Template</span>
            <span className='md:hidden'>Template</span>
          </button>
        </div>
      </div>

      {/* Main Controls Area */}
      <div className='mt-3 md:mt-5'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4'>
          {/* Left Side Buttons */}
          <div className='flex flex-wrap gap-2 items-center order-2 md:order-1'>
            <button
              type='button'
              className='flex items-center gap-1 text-xs md:text-sm font-normal shadow-lg rounded-md border border-red-600 text-red-600 hover:bg-red-800 hover:text-white py-1 px-2 md:px-3 cursor-pointer whitespace-nowrap'
              onClick={handleDeleteSelectedClick}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='14'
                height='14'
                fill='currentColor'
                className='cursor-pointer'
                viewBox='0 0 16 16'
              >
                <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z'></path>
                <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z'></path>
              </svg>
              <span>Delete Selected</span>
            </button>
            <button
              type='button'
              className='flex items-center gap-1 text-xs md:text-sm font-normal shadow-lg rounded-md border border-ocean text-ocean hover:bg-ocean hover:text-white py-1 px-2 md:px-3 cursor-pointer whitespace-nowrap'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='14'
                height='14'
                fill='currentColor'
                className='bi bi-filter-left'
                viewBox='0 0 16 16'
              >
                <path d='M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5' />
              </svg>
              <span className='hidden md:inline'>Display Setting</span>
              <span className='md:hidden'>Settings</span>
            </button>

            {/* Switch for Custom Print Area */}
            <div className='ml-0 md:ml-2 mt-2 md:mt-0'>
              <FormControlLabel
                control={
                  <Switch
                    checked={isCustomPrintArea}
                    onChange={handleSwitchChange}
                    color='primary'
                    size='small'
                  />
                }
                label={
                  <span className='text-xs md:text-sm'>
                    <span className='hidden md:inline'>Custom Variant's Printarea</span>
                    <span className='md:hidden'>Custom Printarea</span>
                  </span>
                }
                className='text-xs md:text-sm'
              />
            </div>

            {/* Custom Print Area Button - Only show when switch is on */}
            {isCustomPrintArea && (
              <button
                type='button'
                className='flex items-center gap-1 text-xs md:text-sm font-normal shadow-lg rounded-md border border-green-600 text-green-600 hover:bg-green-700 hover:text-white py-1 px-2 md:px-3 cursor-pointer whitespace-nowrap ml-0 md:ml-2'
                onClick={handleModalOpen}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='14'
                  height='14'
                  fill='currentColor'
                  className='bi bi-plus-circle'
                  viewBox='0 0 16 16'
                >
                  <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
                  <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z' />
                </svg>
                <span>Add Print Area</span>
              </button>
            )}
          </div>

          {/* New Variant Button */}
          <div className='order-1 md:order-2 mb-2 md:mb-0'>
            <button
              type='button'
              className='flex items-center justify-center gap-2 text-sm font-normal shadow-lg bg-tiger hover:bg-hoverTiger rounded-md text-white py-2 px-3 md:px-4 w-full md:w-auto cursor-pointer'
              onClick={handleNewVariantClick}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                fill='#fff'
                className='bi bi-plus'
                viewBox='0 0 16 16'
              >
                <path
                  fill='#fff'
                  d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4'
                />
              </svg>
              <span>New Variant</span>
            </button>
          </div>
        </div>

        {/* Modal for Print Area - Responsive */}
        <Dialog
          open={modalOpen}
          onClose={handleModalClose}
          maxWidth='sm'
          fullWidth
          fullScreen={window.innerWidth < 768} // Fullscreen on mobile
        >
          <DialogTitle className='text-lg md:text-xl'>Add Custom Print Area</DialogTitle>
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
                margin='dense'
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
                margin='dense'
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
                margin='dense'
              />

              {/* Width and Height Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                  margin='dense'
                  fullWidth
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
                  margin='dense'
                  fullWidth
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions className='p-4'>
            <Button
              onClick={handleModalClose}
              color='secondary'
              size='small'
              className='text-xs md:text-sm'
            >
              Cancel
            </Button>
            <Button
              onClick={handlePrintAreaSubmit}
              variant='contained'
              size='small'
              className='text-xs md:text-sm'
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
          isCustomPrintArea={isCustomPrintArea}
          showForm={showForm}
          onFormClose={handleFormClose}
          deleteSelectedTrigger={deleteSelectedTrigger}
        />
      </div>
    </div>
  );
}

export default ProductVariant;