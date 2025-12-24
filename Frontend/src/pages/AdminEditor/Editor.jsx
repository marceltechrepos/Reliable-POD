import React, { useState, useEffect } from 'react';

function Editor() {
    const savedMockup = localStorage.getItem('mockupToEdit');
    console.log(savedMockup)
    return (
        <div className='w-screen h-screen bg-gray-900 text-white'>Editor</div>
    )
}

export default Editor