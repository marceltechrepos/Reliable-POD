import React from 'react';
import { Modal, Box, TextField } from '@mui/material';

function AddProviderModal({
  open,
  onClose,
  newProvider,
  setNewProvider,
  onAdd,
}) {
  return (
    <Modal open={open} onClose={onClose}>
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
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onAdd}
            className="px-4 py-2 text-sm bg-ocean text-white rounded-md cursor-pointer"
          >
            Add Provider
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default AddProviderModal;
