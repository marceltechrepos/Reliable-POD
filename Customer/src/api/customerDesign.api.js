import { toPng, toJpeg } from "html-to-image";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const waitForCanvasReady = async (container, maxFrames = 20) => {
  if (!container) return;
  let frame = 0;
  return new Promise((resolve) => {
    const check = () => {
      const canvases = container.querySelectorAll('canvas');
      let allDrawn = true;
      for (const canvas of canvases) {
        if (canvas.width === 0 || canvas.height === 0) {
          allDrawn = false;
          break;
        }
        if (canvas.dataset.engine === 'three') continue;
        try {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.getImageData(0, 0, 1, 1);
          // Ensure at least one non‑transparent pixel exists (optional)
          // const hasContent = imgData.data.some(ch => ch !== 0);
          // if (!hasContent) allDrawn = false;
        } catch (e) {
          // ignore
        }
      }
      if (allDrawn || frame >= maxFrames) {
        resolve();
      } else {
        frame++;
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  });
};
export const captureElementAsFile = async (element, transparent = false) => {
  if (!element) return null;
  await waitForCanvasReady(element);
  try {
    // Temporarily hide any unwanted UI (e.g., resize handles)
    const handles = element.querySelectorAll('.react-resizable-handle');
    handles.forEach(h => (h.style.display = 'none'));
    
    // Temporarily remove print-area styles
    const originalBorder = element.style.border;
    const originalBackground = element.style.background;
    const originalBackgroundColor = element.style.backgroundColor;
    
    element.style.border = 'none';
    element.style.background = 'transparent';
    element.style.backgroundColor = 'transparent';
    element.classList.add('capture-hide-border');

    const dataUrl = transparent
      ? await toPng(element, { pixelRatio: 2, cacheBust: true })
      : await toJpeg(element, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff', cacheBust: true });

    handles.forEach(h => (h.style.display = ''));
    
    // Restore print-area styles
    element.style.border = originalBorder;
    element.style.background = originalBackground;
    element.style.backgroundColor = originalBackgroundColor;
    element.classList.remove('capture-hide-border');

    const blob = await fetch(dataUrl).then(r => r.blob());
    return new File([blob], `printarea-${Date.now()}.${transparent ? 'png' : 'jpg'}`, { type: `image/${transparent ? 'png' : 'jpeg'}` });
  } catch (err) {
    console.error('Capture failed', err);
    return null;
  }
};

// export const captureFinalDesign = async (designContainerRef) => {
//   if (!designContainerRef.current) return null;
//   try {
//     const borders = designContainerRef.current.querySelectorAll('.print-area-border');
//     borders.forEach(el => el.classList.add('capture-hide-border'));
//     await new Promise(resolve => requestAnimationFrame(resolve));

//     const dataUrl = await toJpeg(designContainerRef.current, {
//       quality: 0.95,
//       pixelRatio: 2,
//       backgroundColor: '#ffffff',
//       cacheBust: true,
//     });

//     borders.forEach(el => el.classList.remove('capture-hide-border'));

//     const blob = await (await fetch(dataUrl)).blob();
//     const file = new File([blob], `final-design-${Date.now()}.jpg`, { type: 'image/jpeg' });
//     return file;
//   } catch (err) {
//     console.error('Capture error:', err);
//     return null;
//   }
// };


export const captureFinalDesign = async (designContainerRef, options = {}) => {
  if (!designContainerRef?.current) return null;
  try {
    const borders = designContainerRef.current.querySelectorAll('.print-area-border');
    borders.forEach(el => el.classList.add('capture-hide-border'));
    await new Promise(r => requestAnimationFrame(r));

    const convertFn = options.transparent ? toPng : toJpeg;
    const dataUrl = await convertFn(designContainerRef.current, {
      quality: options.quality ?? 0.95,
      pixelRatio: 2,
      backgroundColor: options.transparent ? null : '#ffffff',
      cacheBust: true,
    });

    borders.forEach(el => el.classList.remove('capture-hide-border'));

    if (!dataUrl) throw new Error('No dataUrl generated');
    const blob = await fetch(dataUrl).then(r => r.blob());
    if (!blob || blob.size === 0) throw new Error('Empty blob');
    const ext = options.transparent ? 'png' : 'jpg';
    const file = new File([blob], `design-${Date.now()}.${ext}`, { type: `image/${ext}` });
    return file;
  } catch (err) {
    console.error('Capture error:', err);
    return null;
  }
};

export const uploadFinalImage = async (designId, file) => {
  if (!designId || !file) return false;
  const formData = new FormData();
  formData.append('image', file);
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/customer/designs/${designId}/final-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      console.log('Final image uploaded successfully');
      return true;
    } else {
      console.warn('Final image upload failed:', data.message);
      return false;
    }
  } catch (err) {
    console.error('Upload error:', err);
    return false;
  }
};

// Upload image
export const uploadCustomerImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  return await res.json();
};

// Save design
export const saveCustomerDesign = async (data) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

// Get design
export const getCustomerDesign = async (productId, mockupId) => {
  const token = localStorage.getItem('token');
  const url = `${BASE_URL}/api/customer/designs/${productId}${mockupId ? `?mockupId=${mockupId}` : ''}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
};

// Delete layer
export const deleteCustomerLayer = async (layerId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs/layer/${layerId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
};

export const updateCustomerLayer = async (layerId, data) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}/api/customer/designs/layer/${layerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};


export const getcustomerDesignByuserId = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/customer/designs/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json();

    if (!res.ok) {
      console.warn(data.message);
      return [];
    }

    return data.success ? data.data : [];
  } catch (error) {
    console.log(error, "<<< error");
    return error;
  }
}

// Update existing design
export const updateCustomerDesign = async (designId, data) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/customer/designs/${designId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error("updateCustomerDesign error:", error);
    return { success: false, message: "Network error" };
  }
};

export const getCustomerDesignById = async (designId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/customer/designs/single/${designId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.error("getCustomerDesignById error:", error);
    return { success: false, message: "Network error" };
  }
};


// ==================================================================

// Upload image for a specific mockup
export const uploadMockupImage = async (designId, imageFile, mockupId) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('mockupId', mockupId);

  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs/${designId}/mockup-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return await res.json();
};

// Update design with all mockup images
export const updateDesignMockupImages = async (designId, finalDesignImages) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/customer/designs/${designId}/mockup-images`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ finalDesignImages })
  });
  return await res.json();
};

export const getMockupById = async (mockupId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/get-single-mockup/${mockupId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
};