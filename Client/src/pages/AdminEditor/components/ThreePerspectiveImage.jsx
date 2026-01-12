import React, { useRef, useState, useMemo, useEffect, forwardRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Corner Handle with Event Forwarding
const CornerHandle = forwardRef(({ position, index, onDrag, size = 0.5 }, ref) => {
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const localRef = useRef();
  const actualRef = ref || localRef;

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      onDrag(index, intersection);
    };

    const handlePointerUp = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { capture: true });
    window.addEventListener("pointerup", handlePointerUp, { capture: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove, { capture: true });
      window.removeEventListener("pointerup", handlePointerUp, { capture: true });
    };
  }, [isDragging, camera, gl, index, onDrag]);

  return (
    <mesh
      ref={actualRef}
      position={[position.x, position.y, 10]} // HIGHER Z-index for Three.js
      scale={[size, size, size]}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setIsDragging(true);
        return false;
      }}
      raycast={() => null} // Important: Allow raycasting through
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#f59e0b" />
    </mesh>
  );
});

// Main Image Component
function PerspectiveImage3D({ 
  src, 
  corners: initialCorners, 
  width, 
  height,
  onCornersChange 
}) {
  const texture = useTexture(src);
  const meshRef = useRef();
  const [corners, setCorners] = useState(initialCorners);

  useEffect(() => {
    setCorners(initialCorners);
  }, [initialCorners]);

  const geometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const positions = geometry.attributes.position;
    const uvs = geometry.attributes.uv;

    for (let i = 0; i < positions.count; i++) {
      const u = uvs.getX(i);
      const v = uvs.getY(i);

      const topX = corners[0].x + (corners[1].x - corners[0].x) * u;
      const topY = corners[0].y + (corners[1].y - corners[0].y) * u;

      const bottomX = corners[3].x + (corners[2].x - corners[3].x) * u;
      const bottomY = corners[3].y + (corners[2].y - corners[3].y) * u;

      const finalX = topX + (bottomX - topX) * v;
      const finalY = topY + (bottomY - topY) * v;

      positions.setXYZ(i, 
        (finalX - width / 2) / 100, 
        (finalY - height / 2) / 100 * -1, 
        0
      );
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, [corners, width, height]);

  const handleCornerDrag = (index, newPos) => {
    const updatedCorners = [...corners];
    updatedCorners[index] = {
      x: newPos.x * 100 + width / 2,
      y: -newPos.y * 100 + height / 2
    };

    setCorners(updatedCorners);
    
    if (onCornersChange) {
      onCornersChange(updatedCorners);
    }
  };

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial 
          map={texture} 
          side={THREE.DoubleSide}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* Corner handles with HIGH z-index */}
      {corners.map((corner, index) => (
        <CornerHandle
          key={index}
          index={index}
          position={{
            x: (corner.x - width / 2) / 100,
            y: -(corner.y - height / 2) / 100,
          }}
          onDrag={handleCornerDrag}
          size={0.05} // Bigger size
        />
      ))}
    </group>
  );
}

// Canvas Wrapper with PROPER event handling
export function ThreePerspectiveCanvas({ 
  src, 
  corners, 
  width, 
  height, 
  onCornersChange 
}) {
  const canvasRef = useRef();

  return (
    <div 
      ref={canvasRef}
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000, // HIGH Z-INDEX
        pointerEvents: 'auto', // IMPORTANT
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Canvas
        camera={{
          position: [0, 0, 2],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent',
          pointerEvents: 'auto',
        }}
        onPointerMissed={() => {}}
        raycaster={{ params: { Line: { threshold: 100 } } }}
      >
        <ambientLight intensity={0.5} />
        <PerspectiveImage3D
          src={src}
          corners={corners}
          width={width}
          height={height}
          onCornersChange={onCornersChange}
        />
      </Canvas>
    </div>
  );
}

export default ThreePerspectiveCanvas;