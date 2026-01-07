import React, { useRef, useEffect, useState } from "react";

const WarpedImage = ({ src, corners, width, height, fit = "cover" }) => {
  const canvasRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
  }, [src]);

  useEffect(() => {
    if (imgLoaded && canvasRef.current && imgRef.current) {
      drawPerspectiveCorrect();
    }
  }, [imgLoaded, corners, width, height, fit]);

  const drawPerspectiveCorrect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    
    if (!canvas || !ctx || !img) return;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // 1. Create clipping path for the warped printarea shape
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    ctx.lineTo(corners[1].x, corners[1].y);
    ctx.lineTo(corners[2].x, corners[2].y);
    ctx.lineTo(corners[3].x, corners[3].y);
    ctx.closePath();
    ctx.clip();
    
    // 2. Calculate the bounding box of the warped shape
    const xCoords = corners.map(c => c.x);
    const yCoords = corners.map(c => c.y);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);
    
    // 3. Calculate how to fit the image in the original (unwarped) rectangle
    let srcWidth = img.width;
    let srcHeight = img.height;
    let srcX = 0;
    let srcY = 0;
    
    if (fit === "cover") {
      // Scale image to cover entire area
      const scale = Math.max(width / img.width, height / img.height);
      srcWidth = img.width * scale;
      srcHeight = img.height * scale;
      srcX = (width - srcWidth) / 2;
      srcY = (height - srcHeight) / 2;
    } else if (fit === "contain") {
      // Scale image to fit inside area
      const scale = Math.min(width / img.width, height / img.height);
      srcWidth = img.width * scale;
      srcHeight = img.height * scale;
      srcX = (width - srcWidth) / 2;
      srcY = (height - srcHeight) / 2;
    }
    
    // 4. Map the image from source rectangle to warped quadrilateral
    // Source rectangle corners (in image space)
    const srcCorners = [
      { x: srcX, y: srcY },                     // top-left
      { x: srcX + srcWidth, y: srcY },          // top-right
      { x: srcX + srcWidth, y: srcY + srcHeight }, // bottom-right
      { x: srcX, y: srcY + srcHeight }          // bottom-left
    ];
    
    // Destination corners (warped printarea corners)
    const dstCorners = corners;
    
    // 5. Draw image using perspective transformation
    // We'll use two triangles method for perspective warp
    
    // Triangle 1: Top-left, Top-right, Bottom-left
    drawTexturedTriangle(
      ctx,
      img,
      srcCorners[0], srcCorners[1], srcCorners[3],  // Source triangle
      dstCorners[0], dstCorners[1], dstCorners[3]   // Destination triangle
    );
    
    // Triangle 2: Top-right, Bottom-right, Bottom-left
    drawTexturedTriangle(
      ctx,
      img,
      srcCorners[1], srcCorners[2], srcCorners[3],  // Source triangle
      dstCorners[1], dstCorners[2], dstCorners[3]   // Destination triangle
    );
    
    ctx.restore();
  };

  // Draw a triangle with texture mapping
  const drawTexturedTriangle = (ctx, img, srcA, srcB, srcC, dstA, dstB, dstC) => {
    ctx.save();
    
    // Clip to destination triangle
    ctx.beginPath();
    ctx.moveTo(dstA.x, dstA.y);
    ctx.lineTo(dstB.x, dstB.y);
    ctx.lineTo(dstC.x, dstC.y);
    ctx.closePath();
    ctx.clip();
    
    // Calculate affine transformation matrix from source to destination
    const matrix = calculateAffineTransform(srcA, srcB, srcC, dstA, dstB, dstC);
    
    // Apply the transformation
    ctx.transform(matrix.a, matrix.c, matrix.b, matrix.d, matrix.e, matrix.f);
    
    // Draw the image (now it will be transformed)
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    ctx.restore();
  };

  // Calculate affine transformation between two triangles
  const calculateAffineTransform = (srcA, srcB, srcC, dstA, dstB, dstC) => {
    // Solve for affine transformation: dst = M * src
    
    const x1 = srcA.x, y1 = srcA.y;
    const x2 = srcB.x, y2 = srcB.y;
    const x3 = srcC.x, y3 = srcC.y;
    
    const u1 = dstA.x, v1 = dstA.y;
    const u2 = dstB.x, v2 = dstB.y;
    const u3 = dstC.x, v3 = dstC.y;
    
    // Calculate determinant
    const det = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2);
    
    // If determinant is zero, return identity matrix
    if (Math.abs(det) < 0.0001) {
      return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    }
    
    // Calculate affine transformation matrix
    const a = (u1 * (y2 - y3) + u2 * (y3 - y1) + u3 * (y1 - y2)) / det;
    const b = (u1 * (x3 - x2) + u2 * (x1 - x3) + u3 * (x2 - x1)) / det;
    const c = (v1 * (y2 - y3) + v2 * (y3 - y1) + v3 * (y1 - y2)) / det;
    const d = (v1 * (x3 - x2) + v2 * (x1 - x3) + v3 * (x2 - x1)) / det;
    const e = (u1 * (x2 * y3 - x3 * y2) + u2 * (x3 * y1 - x1 * y3) + u3 * (x1 * y2 - x2 * y1)) / det;
    const f = (v1 * (x2 * y3 - x3 * y2) + v2 * (x3 * y1 - x1 * y3) + v3 * (x1 * y2 - x2 * y1)) / det;
    
    return { a, b, c, d, e, f };
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        backgroundColor: "transparent"
      }}
    />
  );
};

export default WarpedImage;


