import React, { useEffect, useState } from 'react';
import { addPrintArea } from '../api/printArea.api';
import { useParams } from "react-router-dom";
import { getProductById } from '../api/product.api';

function PrintArea() {
  const { id: productId } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [printAreas, setPrintAreas] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    key: '',
    displayName: '',
    width: '',
    height: ''
  });

  const [editFormData, setEditFormData] = useState({
    tib: '',
    key: '',
    displayName: '',
    width: '',
    height: ''
  });

  const generateTIB = () => `PA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  useEffect(() => {
    const fetchPrintAreas = async () => {
      const product = await getProductById(productId);
      if (product?.Printareas) {
        const formatted = product.Printareas.map(item => ({
          id: item._id,
          tib: `PA-${item._id.slice(-6).toUpperCase()}`,
          key: item.fulfiledKey,
          displayName: item.displayName,
          width: item.width,
          height: item.height,
        }));
        setPrintAreas(formatted);
      }
    };
    if (productId) fetchPrintAreas();
  }, [productId]);

  const handleNewPrintClick = () => {
    setShowForm(!showForm);
    setEditingId(null);
    if (!showForm) setFormData({ key: '', displayName: '', width: '', height: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = async () => {
    if (!formData.key || !formData.displayName || !formData.width || !formData.height) {
      alert("Please fill all fields!");
      return;
    }

    const payload = {
      fulfiledKey: formData.key,
      displayName: formData.displayName,
      width: Number(formData.width),
      height: Number(formData.height),
    };

    const res = await addPrintArea(productId, payload);

    if (res?.success) {
      const newPrintArea = {
        id: res.data._id,
        tib: generateTIB(),
        key: res.data.fulfiledKey,
        displayName: res.data.displayName,
        width: res.data.width,
        height: res.data.height,
      };
      setPrintAreas([...printAreas, newPrintArea]);
      setFormData({ key: "", displayName: "", width: "", height: "" });
      setShowForm(false);
    }
  };

  const handleEditClick = (area) => {
    setEditingId(area.id);
    setEditFormData({ ...area });
    setShowForm(false);
  };

  // ---------- UPDATE API USING FETCH ----------
  const handleSaveEdit = async (areaId) => {
    if (!editFormData.key || !editFormData.displayName || !editFormData.width || !editFormData.height) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const url = `/api/${productId}/print-areas/${areaId}`;
      const payload = {
        fulfiledKey: editFormData.key,
        displayName: editFormData.displayName,
        width: Number(editFormData.width),
        height: Number(editFormData.height),
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setPrintAreas(prev =>
          prev.map(area => area.id === areaId ? { ...area, ...editFormData } : area)
        );
        setEditingId(null);
        alert("Print area updated successfully");
      } else {
        alert("Failed to update print area");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update print area");
    }
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this print area?')) {
      setPrintAreas(prev => prev.filter(area => area.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  return (
    <div className='print-area bg-white border-s-5 border-ocean border-solid mt-5 p-4 rounded-xl'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className="text-2xl font-bold text-black">Print Area</h2>
        <button
          type='button'
          className='flex items-center gap-2 text-sm font-normal shadow-lg bg-tiger hover:bg-hoverTiger rounded-md text-white py-2 px-4 cursor-pointer'
          onClick={handleNewPrintClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-plus" viewBox="0 0 16 16">
            <path fill='#fff' d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          {showForm ? 'Cancel' : 'New Print'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className='add-print-form bg-gray-50 p-4 rounded-lg mb-6 mt-4'>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Print Area</h3>
          <div className="grid grid-cols-5 gap-4 mb-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fulfill Key *</label>
              <input type="text" name="key" value={formData.key} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
              <input type="text" name="displayName" value={formData.displayName} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (px) *</label>
              <input type="number" name="width" value={formData.width} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (px) *</label>
              <input type="number" name="height" value={formData.height} onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean" />
            </div>
            <div className="text-end">
              <button type="button" className="bg-ocean hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium" onClick={handleAddClick}>
                Add Print Area
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Areas Table */}
      <div className='mt-10 w-full'>
        <ul className="grid grid-cols-6 font-semibold border-b border-gray-200 pb-2">
          <li>TIB</li>
          <li>Fulfill Key</li>
          <li>Display Name</li>
          <li>Width (px)</li>
          <li>Height (px)</li>
          <li>Actions</li>
        </ul>

        {printAreas.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 text-lg">No record found!</p>
          </div>
        ) : (
          printAreas.map(area => (
            <div key={area.id} className='print-area-item'>
              {editingId === area.id ? (
                <ul className="grid grid-cols-6 items-center border-b border-gray-200 py-2 gap-2">
                  <li><input value={editFormData.tib} disabled className="w-full px-2 py-1 border border-gray-300 rounded text-ocean" /></li>
                  <li><input name="key" value={editFormData.key} onChange={handleEditInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-ocean" /></li>
                  <li><input name="displayName" value={editFormData.displayName} onChange={handleEditInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-ocean" /></li>
                  <li><input name="width" value={editFormData.width} onChange={handleEditInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-ocean" /></li>
                  <li><input name="height" value={editFormData.height} onChange={handleEditInputChange} className="w-full px-2 py-1 border border-gray-300 rounded text-ocean" /></li>
                  <li className="flex gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm" onClick={() => handleSaveEdit(area.id)}>Save</button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded text-sm" onClick={handleCancelEdit}>Cancel</button>
                  </li>
                </ul>
              ) : (
                <ul className="grid grid-cols-6 items-center border-b border-gray-200 py-2">
                  <li className='text-ocean'>{area.tib}</li>
                  <li className='text-ocean'>{area.key}</li>
                  <li className='text-ocean'>{area.displayName}</li>
                  <li className='text-ocean'>{area.width}</li>
                  <li className='text-ocean'>{area.height}</li>
                  <li className="flex gap-2">
                    <svg className='cursor-pointer bi bi-pencil-square' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" onClick={() => handleEditClick(area)}>
                      <path fill='#3b6d92' d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path fill='#3b6d92' fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                    <svg className='bi bi-trash cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" onClick={() => handleDeleteClick(area.id)}>
                      <path fill='#ff0000' d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path fill='#ff0000' d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </li>
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PrintArea;
