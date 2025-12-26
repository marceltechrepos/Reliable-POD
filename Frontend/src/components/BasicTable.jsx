// import React, { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Cancel';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import AddIcon from '@mui/icons-material/Add';
// import CardContent from '@mui/material/CardContent';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import { useParams } from "react-router-dom";

// // Helper function to create data
// function createData(id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available, addToCampaigns, createdAt, updatedAt) {
//   return { id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available, addToCampaigns, createdAt, updatedAt };
// }

// export default function BasicTable({ showForm, onFormClose, deleteSelectedTrigger, isCustomPrintArea }) {
//   const { id } = useParams();
//   // Initial sample data
//   // const initialRows = [
//   //   createData(
//   //     uuidv4(),
//   //     "SKU001",
//   //     "White",
//   //     "24'",
//   //     "#ffffff",
//   //     "1.5 kg",
//   //     29.99,
//   //     39.99,
//   //     15.00,
//   //     "available",
//   //     false,
//   //     "2024-01-15",
//   //     "2024-01-20"
//   //   ),
//   //   createData(
//   //     uuidv4(),
//   //     "SKU002",
//   //     "Black",
//   //     "M",
//   //     "#000000",
//   //     "1.2 kg",
//   //     34.99,
//   //     44.99,
//   //     18.00,
//   //     "available",
//   //     true,
//   //     "2024-01-10",
//   //     "2024-01-18"
//   //   ),
//   //   createData(
//   //     uuidv4(),
//   //     "SKU003",
//   //     "Blue",
//   //     "L",
//   //     "#0000ff",
//   //     "1.8 kg",
//   //     39.99,
//   //     49.99,
//   //     22.00,
//   //     "out of stock",
//   //     false,
//   //     "2024-01-05",
//   //     "2024-01-15"
//   //   ),
//   // ];



//   // State management
//   const [rows, setRows] = useState([]);

//   const [internalShowForm, setInternalShowForm] = useState(showForm || false);
//   const [editingId, setEditingId] = useState(null);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [printAreaData, setPrintAreaData] = useState({
//     key: '',
//     displayName: '',
//     width: '',
//     height: ''
//   });

//   // Form data for new variant
//   const [formData, setFormData] = useState({
//     sku: '',
//     color: '',
//     size: '',
//     colorHex: '#ffffff',
//     weight: '',
//     price: '',
//     comparePrice: '',
//     baseCost: '',
//     available: 'available',
//     addToCampaigns: false,
//   });

//   // Form data for editing
//   const [editFormData, setEditFormData] = useState({
//     sku: '',
//     color: '',
//     size: '',
//     colorHex: '',
//     weight: '',
//     price: '',
//     comparePrice: '',
//     baseCost: '',
//     available: 'available',
//     addToCampaigns: false,
//   });

//   // Sync with parent component's showForm prop
//   useEffect(() => {
//     setInternalShowForm(showForm);
//     if (showForm) {
//       setEditingId(null);
//       setFormData({
//         sku: '',
//         color: '',
//         size: '',
//         colorHex: '#ffffff',
//         weight: '',
//         price: '',
//         comparePrice: '',
//         baseCost: '',
//         available: 'available',
//         addToCampaigns: false,
//       });
//     }
//   }, [showForm]);

//   // Handle delete selected trigger from parent
//   useEffect(() => {
//     if (deleteSelectedTrigger) {
//       handleDeleteSelected();
//     }
//   }, [deleteSelectedTrigger]);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'addToCampaigns' ? e.target.checked : value
//     });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";

//     const date = new Date(dateString);
//     return date.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     if (!id) return;

//     const fetchVariants = async () => {
//       try {
//         const res = await fetch(`/api/${id}/get-variant`);
//         const json = await res.json();

//         if (json.success) {
//           const mappedRows = json.data.map((item) => ({
//             id: item._id, // mongo id
//             sku: item.sku,
//             color: item.color,
//             size: item.size,
//             colorHex: item.colorHex || "#ffffff",
//             weight: item.weight,
//             price: item.basePrice,
//             comparePrice: null,
//             baseCost: null,
//             available: "available",
//             addToCampaigns: false,
//             createdAt: formatDate(item.createdAt),
//             updatedAt: formatDate(item.updatedAt),
//           }));

//           setRows(mappedRows);
//         }
//       } catch (error) {
//         console.error("failed to fetch variants", error);
//       }
//     };

//     fetchVariants();
//   }, [id]);



//   // Handle print area input change
//   const handlePrintAreaChange = (event) => {
//     const { name, value } = event.target;
//     setPrintAreaData({
//       ...printAreaData,
//       [name]: value,
//     });
//   };


//   // Generate TIB function
//   const generateTIB = () => {
//     const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
//     return `PA-${randomPart}`;
//   };

//   // Make modal row-aware: show clicked row's id as TIB (fallback to generated)
//   const handleModalOpen = (row) => {
//     const tibValue = (row && row.id) ? row.id : generateTIB();
//     setPrintAreaData({
//       tib: tibValue,
//       key: row?.key || '',
//       displayName: row?.displayName || '',
//       width: row?.width || '',
//       height: row?.height || '',
//     });
//     setModalOpen(true);
//   };

//   // Handle modal close
//   const handleModalClose = () => {
//     setModalOpen(false);
//     setPrintAreaData({
//       key: '',
//       displayName: '',
//       width: '',
//       height: ''
//     });
//   };
//   // Handle edit input changes
//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({
//       ...editFormData,
//       [name]: name === 'addToCampaigns' ? e.target.checked : value
//     });
//   };

//   // Handle form submit (Add new variant)
//   const handleSubmit = () => {
//     // Basic validation
//     if (!formData.sku || !formData.color || !formData.size || !formData.price) {
//       alert('Please fill all required fields!');
//       return;
//     }

//     const currentDate = new Date().toISOString().split('T')[0];

//     const newRow = createData(
//       uuidv4(), // Auto-generated ID
//       formData.sku,
//       formData.color,
//       formData.size,
//       formData.colorHex,
//       formData.weight,
//       parseFloat(formData.price),
//       formData.comparePrice ? parseFloat(formData.comparePrice) : null,
//       formData.baseCost ? parseFloat(formData.baseCost) : null,
//       formData.available,
//       formData.addToCampaigns,
//       currentDate,
//       currentDate
//     );

//     setRows([...rows, newRow]);
//     setInternalShowForm(false);
//     if (onFormClose) onFormClose();

//     // Reset form
//     setFormData({
//       sku: '',
//       color: '',
//       size: '',
//       colorHex: '#ffffff',
//       weight: '',
//       price: '',
//       comparePrice: '',
//       baseCost: '',
//       available: 'available',
//       addToCampaigns: false,
//     });
//   };

//   // Handle edit button click
//   const handleEditClick = (row) => {
//     setEditingId(row.id);
//     setInternalShowForm(false);
//     if (onFormClose) onFormClose();

//     setEditFormData({
//       sku: row.sku,
//       color: row.color,
//       size: row.size,
//       colorHex: row.colorHex,
//       weight: row.weight,
//       price: row.price.toString(),
//       comparePrice: row.comparePrice ? row.comparePrice.toString() : '',
//       baseCost: row.baseCost ? row.baseCost.toString() : '',
//       available: row.available,
//       addToCampaigns: row.addToCampaigns,
//     });
//   };

//   // Handle save edit
//   const handleSaveEdit = () => {
//     if (!editFormData.sku || !editFormData.color || !editFormData.size || !editFormData.price) {
//       alert('Please fill all required fields!');
//       return;
//     }

//     const updatedDate = new Date().toISOString().split('T')[0];

//     const updatedRows = rows.map(row => {
//       if (row.id === editingId) {
//         return {
//           ...row,
//           sku: editFormData.sku,
//           color: editFormData.color,
//           size: editFormData.size,
//           colorHex: editFormData.colorHex,
//           weight: editFormData.weight,
//           price: parseFloat(editFormData.price),
//           comparePrice: editFormData.comparePrice ? parseFloat(editFormData.comparePrice) : null,
//           baseCost: editFormData.baseCost ? parseFloat(editFormData.baseCost) : null,
//           available: editFormData.available,
//           addToCampaigns: editFormData.addToCampaigns,
//           updatedAt: updatedDate,
//         };
//       }
//       return row;
//     });

//     setRows(updatedRows);
//     setEditingId(null);
//   };

//   // Handle delete button click
//   const handleDeleteClick = (id) => {
//     if (window.confirm('Are you sure you want to delete this variant?')) {
//       const updatedRows = rows.filter(row => row.id !== id);
//       setRows(updatedRows);
//       // Remove from selected rows if present
//       setSelectedRows(selectedRows.filter(rowId => rowId !== id));
//     }
//   };

//   // Handle checkbox change
//   const handleCheckboxChange = (id) => {
//     if (selectedRows.includes(id)) {
//       setSelectedRows(selectedRows.filter(rowId => rowId !== id));
//     } else {
//       setSelectedRows([...selectedRows, id]);
//     }
//   };

//   // Handle select all checkbox
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedRows(rows.map(row => row.id));
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   // Handle delete selected rows
//   const handleDeleteSelected = () => {
//     if (selectedRows.length === 0) {
//       alert('Please select at least one row to delete.');
//       return;
//     }

//     if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected variant(s)?`)) {
//       const updatedRows = rows.filter(row => !selectedRows.includes(row.id));
//       setRows(updatedRows);
//       setSelectedRows([]);
//     }
//   };

//   // Cancel edit
//   const handleCancelEdit = () => {
//     setEditingId(null);
//   };

//   // Cancel form
//   const handleCancelForm = () => {
//     setInternalShowForm(false);
//     if (onFormClose) onFormClose();
//   };
// ;

//   // Available options
//   const availableOptions = [
//     { value: 'available', label: 'Available' },
//     { value: 'out of stock', label: 'Out of Stock' },
//     { value: 'coming soon', label: 'Coming Soon' },
//     { value: 'discontinued', label: 'Discontinued' },
//   ];


//   // Handle print area form submit
//   const handlePrintAreaSubmit = () => {
//     // Basic validation
//     if (!printAreaData.key || !printAreaData.displayName || !printAreaData.width || !printAreaData.height) {
//       alert('Please fill all fields!');
//       return;
//     }

//     // Here you would typically save the print area data
//     // For example: send to API, update state, etc.
//     const newPrintArea = {
//       id: Date.now(), // You might want to use UUID here
//       tib: printAreaData.tib || generateTIB(),
//       key: printAreaData.key,
//       displayName: printAreaData.displayName,
//       width: printAreaData.width,
//       height: printAreaData.height,
//       createdAt: new Date().toISOString(),
//     };

//     console.log('New Print Area Added:', newPrintArea);

//     // Show success message
//     alert('Print area added successfully!');

//     handleModalClose();
//   };

//   return (
//     <Box>
//       {/* Add Variant Form */}
//       {internalShowForm && (
//         <Card sx={{ mb: 3 }}>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Add New Variant
//             </Typography>
//             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
//               <TextField
//                 label="Fulfield SKU *"
//                 name="sku"
//                 value={formData.sku}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//                 required
//               />
//               <TextField
//                 label="Color *"
//                 name="color"
//                 value={formData.color}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//                 required
//               />
//               <TextField
//                 label="Size *"
//                 name="size"
//                 value={formData.size}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//                 required
//               />
//               <TextField
//                 label="Color Hex"
//                 name="colorHex"
//                 value={formData.colorHex}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//                 type="color"
//                 InputProps={{
//                   style: { height: '40px' }
//                 }}
//               />
//               <TextField
//                 label="Weight"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//               />
//               <TextField
//                 label="Price (GBP) *"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//                 type="number"
//                 InputProps={{ inputProps: { step: 0.01 } }}
//                 required
//               />
//               <TextField
//                 label="Compare Price"
//                 name="comparePrice"
//                 value={formData.comparePrice}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//                 type="number"
//                 InputProps={{ inputProps: { step: 0.01 } }}
//               />
//               <TextField
//                 label="Base Cost"
//                 name="baseCost"
//                 value={formData.baseCost}
//                 onChange={handleInputChange}
//                 fullWidth
//                 size="small"
//                 type="number"
//                 InputProps={{ inputProps: { step: 0.01 } }}
//               />
//               <FormControl fullWidth size="small">
//                 <InputLabel>Available</InputLabel>
//                 <Select
//                   name="available"
//                   value={formData.available}
//                   onChange={handleInputChange}
//                   label="Available"
//                 >
//                   {availableOptions.map(option => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Checkbox
//                   name="addToCampaigns"
//                   checked={formData.addToCampaigns}
//                   onChange={handleInputChange}
//                 />
//                 <Typography>Add to Campaigns</Typography>
//               </Box>
//               <TextField
//                 label="TIB Variant ID"
//                 value="Auto-generated on save"
//                 fullWidth
//                 size="small"
//                 disabled
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 helperText="Auto-generated unique ID"
//               />
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
//               <Button
//                 variant="outlined"
//                 onClick={handleCancelForm}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//               >
//                 Add Variant
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       )}

//       {/* Table */}
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox
//                   checked={rows.length > 0 && selectedRows.length === rows.length}
//                   onChange={handleSelectAll}
//                   indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
//                 />
//               </TableCell>
//               <TableCell>TIB Variant ID</TableCell>
//               <TableCell>Fulfield SKU</TableCell>
//               <TableCell>Color</TableCell>
//               <TableCell>Size</TableCell>
//               <TableCell>Color Hex</TableCell>
//               <TableCell>Weight</TableCell>
//               <TableCell>Price(GBP)</TableCell>
//               <TableCell>Compare Price</TableCell>
//               <TableCell>Base Cost</TableCell>
//               <TableCell>Available</TableCell>
//               <TableCell>Add to Campaigns</TableCell>
//               <TableCell>Create at</TableCell>
//               <TableCell>Update at</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//               >
//                 {/* Checkbox cell */}
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={selectedRows.includes(row.id)}
//                     onChange={() => handleCheckboxChange(row.id)}
//                   />
//                 </TableCell>

//                 {/* Edit Mode or View Mode */}
//                 {editingId === row.id ? (
//                   <>
//                     <TableCell>{row.id.substring(0, 8)}...</TableCell>
//                     <TableCell>
//                       <TextField
//                         name="sku"
//                         value={editFormData.sku + "...."}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         fullWidth
//                       />

//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         name="color"
//                         value={editFormData.color}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         name="size"
//                         value={editFormData.size}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         name="colorHex"
//                         value={editFormData.colorHex}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         type="color"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         name="weight"
//                         value={editFormData.weight}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         name="price"
//                         value={editFormData.price}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         type="number"
//                         InputProps={{ inputProps: { step: 0.01 } }}
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         name="comparePrice"
//                         value={editFormData.comparePrice}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         type="number"
//                         InputProps={{ inputProps: { step: 0.01 } }}
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         name="baseCost"
//                         value={editFormData.baseCost}
//                         onChange={handleEditInputChange}
//                         size="small"
//                         type="number"
//                         InputProps={{ inputProps: { step: 0.01 } }}
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <FormControl size="small" fullWidth>
//                         <Select
//                           name="available"
//                           value={editFormData.available}
//                           onChange={handleEditInputChange}
//                         >
//                           {availableOptions.map(option => (
//                             <MenuItem key={option.value} value={option.value}>
//                               {option.label}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </TableCell>
//                     <TableCell>
//                       <Checkbox
//                         name="addToCampaigns"
//                         checked={editFormData.addToCampaigns}
//                         onChange={handleEditInputChange}
//                       />
//                     </TableCell>
//                     <TableCell>{row.createdAt}</TableCell>
//                     <TableCell>{row.updatedAt}</TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <IconButton
//                           color="primary"
//                           onClick={handleSaveEdit}
//                           size="small"
//                         >
//                           <SaveIcon />
//                         </IconButton>
//                         <IconButton
//                           color="secondary"
//                           onClick={handleCancelEdit}
//                           size="small"
//                         >
//                           <CancelIcon />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </>
//                 ) : (
//                   <>
//                     <TableCell>{row.id.substring(0, 8)}...</TableCell>
//                     <TableCell>{row.sku}</TableCell>
//                     <TableCell>{row.color}</TableCell>
//                     <TableCell>{row.size}</TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Box
//                           sx={{
//                             width: 20,
//                             height: 20,
//                             backgroundColor: row.colorHex,
//                             border: '1px solid #ccc',
//                             borderRadius: '50%',
//                           }}
//                         />
//                         {row.colorHex}
//                       </Box>
//                     </TableCell>
//                     <TableCell>{row.weight}</TableCell>
//                     <TableCell>£{row.price.toFixed(2)}</TableCell>
//                     <TableCell>
//                       {row.comparePrice ? `£${row.comparePrice.toFixed(2)}` : '-'}
//                     </TableCell>
//                     <TableCell>
//                       {row.baseCost ? `£${row.baseCost.toFixed(2)}` : '-'}
//                     </TableCell>
//                     <TableCell sx={{ padding: "10px" }}>
//                       <Box
//                         sx={{
//                           px: 1,
//                           py: 0.5,
//                           borderRadius: 1,
//                           display: 'inline-block',
//                           textAlign: "center",
//                           width: "100px",
//                           padding: "10px",
//                           backgroundColor:
//                             row.available === 'available'
//                               ? '#e8f5e9'
//                               : row.available === 'out of stock'
//                                 ? '#ffebee'
//                                 : row.available === 'coming soon'
//                                   ? '#fff3e0'
//                                   : '#f5f5f5',
//                           color:
//                             row.available === 'available'
//                               ? '#2e7d32'
//                               : row.available === 'out of stock'
//                                 ? '#c62828'
//                                 : row.available === 'coming soon'
//                                   ? '#f57c00'
//                                   : '#616161',
//                         }}
//                       >
//                         {row.available}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       {row.addToCampaigns ? 'Yes' : 'No'}
//                     </TableCell>
//                     <TableCell>{formatDate(row.createdAt)}</TableCell>
//                     <TableCell>{formatDate(row.updatedAt)}</TableCell>
//                     <TableCell>

//                       <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                         <IconButton
//                           color="primary"
//                           onClick={() => handleEditClick(row)}
//                           size="small"
//                           title="Edit"
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton
//                           color="error"
//                           onClick={() => handleDeleteClick(row.id)}
//                           size="small"
//                           title="Delete"
//                         >
//                           <DeleteIcon />
//                         </IconButton>

//                         {/* Conditional Button */}
//                         {isCustomPrintArea && (
//                           <Button
//                             variant='contained'
//                             size='small'
//                             onClick={() => handleModalOpen(row)}
//                             sx={{
//                               backgroundColor: '#3b6d92',
//                               color: '#fff !important',
//                               '&:hover': {
//                                 backgroundColor: '#2a4d6e',
//                               },
//                               ml: 2,
//                               minWidth: '5px', // chhota button banane ke liye
//                               padding: '6px',
//                             }}
//                           >
//                             <AddIcon fontSize="small" />
//                           </Button>
//                         )}
//                       </Box>


//                     </TableCell>
//                   </>
//                 )}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>


//         {/* Modal for Print Area */}
//         <Dialog open={modalOpen} onClose={handleModalClose} maxWidth='sm' fullWidth>
//           <DialogTitle>Add Custom Print Area</DialogTitle>
//           <DialogContent>
//             <div className='space-y-4 mt-2'>
//               {/* TIB Field (Read-only, auto-generated) */}
//               <TextField
//                 fullWidth
//                 label='TIB'
//                 value={printAreaData.tib || 'Will be auto-generated'}
//                 variant='outlined'
//                 size='small'
//                 InputProps={{
//                   readOnly: true,
//                 }}
//                 helperText="Auto-generated unique identifier"
//               />

//               {/* Fulfill Key Field */}
//               <TextField
//                 fullWidth
//                 label='Fulfill Key *'
//                 name='key'
//                 value={printAreaData.key}
//                 onChange={handlePrintAreaChange}
//                 variant='outlined'
//                 size='small'
//                 required
//                 placeholder='Enter Fulfill Key (e.g., Front, Back)'
//               />

//               {/* Display Name Field */}
//               <TextField
//                 fullWidth
//                 label='Display Name *'
//                 name='displayName'
//                 value={printAreaData.displayName}
//                 onChange={handlePrintAreaChange}
//                 variant='outlined'
//                 size='small'
//                 required
//                 placeholder='Enter Display Name'
//               />

//               {/* Width and Height Fields */}
//               <div className='grid grid-cols-2 gap-4'>
//                 <TextField
//                   label='Width (px) *'
//                   name='width'
//                   value={printAreaData.width}
//                   onChange={handlePrintAreaChange}
//                   variant='outlined'
//                   size='small'
//                   type='number'
//                   required
//                   placeholder='e.g., 1314'
//                 />
//                 <TextField
//                   label='Height (px) *'
//                   name='height'
//                   value={printAreaData.height}
//                   onChange={handlePrintAreaChange}
//                   variant='outlined'
//                   size='small'
//                   type='number'
//                   required
//                   placeholder='e.g., 1314'
//                 />
//               </div>
//             </div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleModalClose} color='secondary'>
//               Cancel
//             </Button>
//             <Button
//               onClick={handlePrintAreaSubmit}
//               variant='contained'
//               sx={{
//                 backgroundColor: '#3b6d92',
//                 '&:hover': {
//                   backgroundColor: '#2a4d6e'
//                 }
//               }}
//             >
//               Add Print Area
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {rows.length === 0 && (
//           <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
//             <Typography>No variants found. Click "New Variant" to add one.</Typography>
//           </Box>
//         )}
//       </TableContainer>
//     </Box>
//   );
// }


// ========================================================================================================

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useParams } from "react-router-dom";

// Helper function to create data (local usage)
function createData(id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available, addToCampaigns, createdAt, updatedAt) {
  return { id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available, addToCampaigns, createdAt, updatedAt };
}

export default function BasicTable({ showForm, onFormClose, deleteSelectedTrigger, isCustomPrintArea }) {
  const { id } = useParams(); // product id from route

  // State
  const [rows, setRows] = useState([]);
  const [internalShowForm, setInternalShowForm] = useState(showForm || false);
  const [editingId, setEditingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [printAreaData, setPrintAreaData] = useState({ key: '', displayName: '', width: '', height: '' });

  // Form data for new variant
  const [formData, setFormData] = useState({
    sku: '',
    color: '',
    size: '',
    colorHex: '#ffffff',
    weight: '',
    price: '',
    comparePrice: '',
    baseCost: '',
    available: 'available',
    addToCampaigns: false,
  });

  // Form data for editing
  const [editFormData, setEditFormData] = useState({
    sku: '',
    color: '',
    size: '',
    colorHex: '',
    weight: '',
    price: '',
    comparePrice: '',
    baseCost: '',
    available: 'available',
    addToCampaigns: false,
  });

  useEffect(() => {
    setInternalShowForm(showForm);
    if (showForm) {
      setEditingId(null);
      setFormData({
        sku: '',
        color: '',
        size: '',
        colorHex: '#ffffff',
        weight: '',
        price: '',
        comparePrice: '',
        baseCost: '',
        available: 'available',
        addToCampaigns: false,
      });
    }
  }, [showForm]);

  // handle parent-triggered delete (if used)
  useEffect(() => {
    if (deleteSelectedTrigger) {
      handleDeleteSelected();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSelectedTrigger]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toISOString().split("T")[0];
  };

  // fetch variants on mount / id change
  useEffect(() => {
    if (!id) return;

    const fetchVariants = async () => {
      try {
        const res = await fetch(`/api/${id}/get-variant`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const mappedRows = json.data.map((item) => ({
            id: item._id, // important — use server id
            sku: item.sku,
            color: item.color,
            size: item.size,
            colorHex: item.colorHex || "#ffffff",
            weight: item.weight,
            price: item.basePrice ?? 0,
            comparePrice: null,
            baseCost: null,
            available: item.available ?? "available",
            addToCampaigns: item.addToCampaigns ?? false,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));

          setRows(mappedRows);
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error("failed to fetch variants", error);
      }
    };

    fetchVariants();
  }, [id]);

  // form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'addToCampaigns' ? checked : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'addToCampaigns' ? checked : value
    }));
  };

  // ---------- CREATE (POST) ----------
  const handleSubmit = async () => {
    if (!formData.sku || !formData.color || !formData.size || !formData.price) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const payload = {
        sku: formData.sku,
        size: isNaN(Number(formData.size)) ? formData.size : Number(formData.size),
        weight: isNaN(Number(formData.weight)) ? formData.weight : Number(formData.weight),
        color: formData.color,
        colorHex: formData.colorHex,
        basePrice: parseFloat(formData.price),
        available: formData.available.toLowerCase().trim(),
        addToCampaigns: formData.addToCampaigns,
      };

      const res = await fetch(`/api/${id}/create-variant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const item = json.data;
        const newRow = {
          id: item._id || uuidv4(),
          sku: item.sku,
          color: item.color,
          size: item.size,
          colorHex: item.colorHex || "#ffffff",
          weight: item.weight,
          price: item.basePrice ?? parseFloat(formData.price),
          comparePrice: null,
          baseCost: null,
          available: formData.available.toLowerCase().trim(), // ✅ yahan formData se
          addToCampaigns: formData.addToCampaigns,          // ✅ yahan formData se
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };

        // append new row
        setRows(prev => [...prev, newRow]);

        // reset form + close
        setInternalShowForm(false);
        if (onFormClose) onFormClose();
        setFormData({
          sku: '',
          color: '',
          size: '',
          colorHex: '#ffffff',
          weight: '',
          price: '',
          comparePrice: '',
          baseCost: '',
          available: 'available',
          addToCampaigns: false,
        });
      } else {
        alert(json.message || 'Failed to create variant');
      }
    } catch (err) {
      console.error("create variant error", err);
      alert('Create request failed. Check console.');
    }
  };

  // ---------- UPDATE (PUT) ----------
  const handleSaveEdit = async () => {
    if (!editFormData.sku || !editFormData.color || !editFormData.size || !editFormData.price) {
      alert('Please fill all required fields!');
      return;
    }

    const variantId = editingId;
    if (!variantId) {
      alert('No variant selected to update.');
      return;
    }

    try {
      const payload = {
        sku: editFormData.sku,
        size: isNaN(Number(editFormData.size)) ? editFormData.size : Number(editFormData.size),
        weight: isNaN(Number(editFormData.weight)) ? editFormData.weight : Number(editFormData.weight),
        color: editFormData.color,
        colorHex: editFormData.colorHex,
        basePrice: parseFloat(editFormData.price),

        available: editFormData.available.toLowerCase().trim(),
        addToCampaigns: editFormData.addToCampaigns,
      };

      console.log("UPDATE PAYLOAD 👉", payload);

      const res = await fetch(`/api/${id}/update-variant/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const item = json.data;
        const updatedRow = {
          id: item._id || variantId,
          sku: item.sku,
          color: item.color,
          size: item.size,
          colorHex: item.colorHex || "#ffffff",
          weight: item.weight,
          price: item.basePrice ?? parseFloat(editFormData.price),
          comparePrice: null,
          baseCost: null,
          available: editFormData.available?.toLowerCase().trim(),
          addToCampaigns: editFormData.addToCampaigns,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };

        setRows(prev => prev.map(r => (r.id === variantId ? updatedRow : r)));
        setEditingId(null);
      } else {
        // fallback: optimistic local update if API didn't return updated object
        const updatedDate = new Date().toISOString();
        setRows(prev => prev.map(row => row.id === variantId ? {
          ...row,
          sku: editFormData.sku,
          color: editFormData.color,
          size: editFormData.size,
          colorHex: editFormData.colorHex,
          weight: editFormData.weight,
          price: parseFloat(editFormData.price),
          comparePrice: editFormData.comparePrice ? parseFloat(editFormData.comparePrice) : null,
          baseCost: editFormData.baseCost ? parseFloat(editFormData.baseCost) : null,
          available: editFormData.available,
          addToCampaigns: editFormData.addToCampaigns,
          updatedAt: updatedDate,
        } : row));
        setEditingId(null);
      }
    } catch (err) {
      console.error("update variant error", err);
      alert('Update request failed. Check console.');
    }
  };

  // ---------- DELETE (single) ----------
  const handleDeleteClick = async (variantId) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) return;
    try {
      const res = await fetch(`/api/${id}/delete-variant/${variantId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setRows(prev => prev.filter(r => r.id !== variantId));
        setSelectedRows(prev => prev.filter(i => i !== variantId));
      } else {
        alert(json.message || 'Delete failed');
      }
    } catch (err) {
      console.error("delete variant error", err);
      alert('Delete request failed. Check console.');
    }
  };

  // delete selected (multiple) - calls delete endpoint for each selected
  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected variant(s)?`)) return;

    try {
      // fire deletions in parallel
      const deletePromises = selectedRows.map(variantId =>
        fetch(`/api/${id}/delete-variant/${variantId}`, { method: 'DELETE' })
          .then(res => res.json())
      );

      const results = await Promise.all(deletePromises);
      // check success for each
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        console.warn('Some deletions failed', failed);
        alert('Some deletions failed. Check console.');
      }
      // remove those that were requested (optimistic)
      setRows(prev => prev.filter(r => !selectedRows.includes(r.id)));
      setSelectedRows([]);
    } catch (err) {
      console.error("delete selected error", err);
      alert('Bulk delete failed. Check console.');
    }
  };

  // other handlers...
  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(rows.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCancelForm = () => {
    setInternalShowForm(false);
    if (onFormClose) onFormClose();
  };

  // print area modal functions (unchanged)
  const handlePrintAreaChange = (event) => {
    const { name, value } = event.target;
    setPrintAreaData(prev => ({ ...prev, [name]: value }));
  };

  const generateTIB = () => {
    const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `PA-${randomPart}`;
  };

  const handleModalOpen = (row) => {
    const tibValue = (row && row.id) ? row.id : generateTIB();
    setPrintAreaData({
      tib: tibValue,
      key: row?.key || '',
      displayName: row?.displayName || '',
      width: row?.width || '',
      height: row?.height || '',
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPrintAreaData({ key: '', displayName: '', width: '', height: '' });
  };

  // prepare edit form when user clicks edit icon
  const handleEditClick = (row) => {
    setEditingId(row.id);
    setInternalShowForm(false);
    if (onFormClose) onFormClose();

    setEditFormData({
      sku: row.sku,
      color: row.color,
      size: row.size,
      colorHex: row.colorHex,
      weight: row.weight,
      price: row.price ? String(row.price) : '',
      comparePrice: row.comparePrice ? String(row.comparePrice) : '',
      baseCost: row.baseCost ? String(row.baseCost) : '',
      available: row.available || 'available',
      addToCampaigns: row.addToCampaigns || false,
    });
  };

  // Available options
  const availableOptions = [
    { value: 'available', label: 'Available' },
    { value: 'out of stock', label: 'Out of Stock' },
    { value: 'coming soon', label: 'Coming Soon' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  // print area submit (unchanged)
  const handlePrintAreaSubmit = () => {
    if (!printAreaData.key || !printAreaData.displayName || !printAreaData.width || !printAreaData.height) {
      alert('Please fill all fields!');
      return;
    }
    const newPrintArea = {
      id: Date.now(),
      tib: printAreaData.tib || generateTIB(),
      key: printAreaData.key,
      displayName: printAreaData.displayName,
      width: printAreaData.width,
      height: printAreaData.height,
      createdAt: new Date().toISOString(),
    };
    console.log('New Print Area Added:', newPrintArea);
    alert('Print area added successfully!');
    handleModalClose();
  };

  return (
    <Box>
      {/* Add Variant Form */}
      {internalShowForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Variant
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
              <TextField label="Fulfield SKU *" name="sku" value={formData.sku} onChange={handleInputChange} fullWidth size="small" required />
              <TextField label="Color *" name="color" value={formData.color} onChange={handleInputChange} fullWidth size="small" required />
              <TextField label="Size *" name="size" value={formData.size} onChange={handleInputChange} fullWidth size="small" required />
              <TextField label="Color Hex" name="colorHex" value={formData.colorHex} onChange={handleInputChange} fullWidth size="small" type="color" InputProps={{ style: { height: '40px' } }} />
              <TextField label="Weight" name="weight" value={formData.weight} onChange={handleInputChange} fullWidth size="small" />
              <TextField label="Price (GBP) *" name="price" value={formData.price} onChange={handleInputChange} fullWidth size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} required />
              <TextField label="Compare Price" name="comparePrice" value={formData.comparePrice} onChange={handleInputChange} fullWidth size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} />
              <TextField label="Base Cost" name="baseCost" value={formData.baseCost} onChange={handleInputChange} fullWidth size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} />
              <FormControl fullWidth size="small">
                <InputLabel>Available</InputLabel>
                <Select name="available" value={formData.available} onChange={handleInputChange} label="Available">
                  {availableOptions.map(option => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox name="addToCampaigns" checked={formData.addToCampaigns} onChange={handleInputChange} />
                <Typography>Add to Campaigns</Typography>
              </Box>
              <TextField label="TIB Variant ID" value="Auto-generated on save" fullWidth size="small" disabled InputProps={{ readOnly: true }} helperText="Auto-generated unique ID" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={handleCancelForm}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit}>Add Variant</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={rows.length > 0 && selectedRows.length === rows.length} onChange={handleSelectAll} indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length} />
              </TableCell>
              <TableCell>TIB Variant ID</TableCell>
              <TableCell>Fulfield SKU</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Color Hex</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Price(GBP)</TableCell>
              <TableCell>Compare Price</TableCell>
              <TableCell>Base Cost</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Add to Campaigns</TableCell>
              <TableCell>Create at</TableCell>
              <TableCell>Update at</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedRows.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} />
                </TableCell>

                {editingId === row.id ? (
                  <>
                    <TableCell>{row.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <TextField name="sku" value={editFormData.sku} onChange={handleEditInputChange} size="small" fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="color" value={editFormData.color} onChange={handleEditInputChange} size="small" fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="size" value={editFormData.size} onChange={handleEditInputChange} size="small" fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="colorHex" value={editFormData.colorHex} onChange={handleEditInputChange} size="small" type="color" />
                    </TableCell>
                    <TableCell>
                      <TextField name="weight" value={editFormData.weight} onChange={handleEditInputChange} size="small" fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="price" value={editFormData.price} onChange={handleEditInputChange} size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="comparePrice" value={editFormData.comparePrice} onChange={handleEditInputChange} size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField name="baseCost" value={editFormData.baseCost} onChange={handleEditInputChange} size="small" type="number" InputProps={{ inputProps: { step: 0.01 } }} fullWidth />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select name="available" value={editFormData.available} onChange={handleEditInputChange}>
                          {availableOptions.map(option => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Checkbox name="addToCampaigns" checked={editFormData.addToCampaigns} onChange={handleEditInputChange} />
                    </TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>{formatDate(row.updatedAt)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton color="primary" onClick={handleSaveEdit} size="small"><SaveIcon /></IconButton>
                        <IconButton color="secondary" onClick={handleCancelEdit} size="small"><CancelIcon /></IconButton>
                      </Box>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{row.id.substring(0, 8)}...</TableCell>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>{row.color}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 20, height: 20, backgroundColor: row.colorHex, border: '1px solid #ccc', borderRadius: '50%' }} />
                        {row.colorHex}
                      </Box>
                    </TableCell>
                    <TableCell>{row.weight}</TableCell>
                    <TableCell>£{(row.price ?? 0).toFixed(2)}</TableCell>
                    <TableCell>{row.comparePrice ? `£${row.comparePrice.toFixed(2)}` : '-'}</TableCell>
                    <TableCell>{row.baseCost ? `£${row.baseCost.toFixed(2)}` : '-'}</TableCell>
                    <TableCell sx={{ padding: "10px" }}>
                      <Box sx={{
                        px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', textAlign: "center", width: "100px", padding: "10px",
                        backgroundColor: row.available === 'available' ? '#e8f5e9' : row.available === 'out of stock' ? '#ffebee' : row.available === 'coming soon' ? '#fff3e0' : '#f5f5f5',
                        color: row.available === 'available' ? '#2e7d32' : row.available === 'out of stock' ? '#c62828' : row.available === 'coming soon' ? '#f57c00' : '#616161',
                      }}>{row.available}</Box>
                    </TableCell>
                    <TableCell>{row.addToCampaigns ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>{formatDate(row.updatedAt)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton color="primary" onClick={() => handleEditClick(row)} size="small" title="Edit"><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(row.id)} size="small" title="Delete"><DeleteIcon /></IconButton>
                        {isCustomPrintArea && (
                          <Button variant='contained' size='small' onClick={() => handleModalOpen(row)} sx={{ backgroundColor: '#3b6d92', color: '#fff !important', '&:hover': { backgroundColor: '#2a4d6e' }, ml: 2, minWidth: '5px', padding: '6px' }}>
                            <AddIcon fontSize="small" />
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal for Print Area */}
        <Dialog open={modalOpen} onClose={handleModalClose} maxWidth='sm' fullWidth>
          <DialogTitle>Add Custom Print Area</DialogTitle>
          <DialogContent>
            <div className='space-y-4 mt-2'>
              <TextField fullWidth label='TIB' value={printAreaData.tib || 'Will be auto-generated'} variant='outlined' size='small' InputProps={{ readOnly: true }} helperText="Auto-generated unique identifier" />
              <TextField fullWidth label='Fulfill Key *' name='key' value={printAreaData.key} onChange={handlePrintAreaChange} variant='outlined' size='small' required placeholder='Enter Fulfill Key (e.g., Front, Back)' />
              <TextField fullWidth label='Display Name *' name='displayName' value={printAreaData.displayName} onChange={handlePrintAreaChange} variant='outlined' size='small' required placeholder='Enter Display Name' />
              <div className='grid grid-cols-2 gap-4'>
                <TextField label='Width (px) *' name='width' value={printAreaData.width} onChange={handlePrintAreaChange} variant='outlined' size='small' type='number' required placeholder='e.g., 1314' />
                <TextField label='Height (px) *' name='height' value={printAreaData.height} onChange={handlePrintAreaChange} variant='outlined' size='small' type='number' required placeholder='e.g., 1314' />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color='secondary'>Cancel</Button>
            <Button onClick={handlePrintAreaSubmit} variant='contained' sx={{ backgroundColor: '#3b6d92', '&:hover': { backgroundColor: '#2a4d6e' } }}>Add Print Area</Button>
          </DialogActions>
        </Dialog>

        {rows.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No variants found. Click "New Variant" to add one.</Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}
