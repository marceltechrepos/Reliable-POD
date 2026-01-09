import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

function Corner({ position, onDrag }) {
  const ref = useRef();
  const { camera, gl } = useThree();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onPointerMove = (e) => {
    if (!ref.current?.dragging) return;

    mouse.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, hit);

    onDrag(hit);
  };

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation();
        ref.current.dragging = true;
      }}
      onPointerUp={() => (ref.current.dragging = false)}
      onPointerMove={onPointerMove}
    >
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

function ImagePlane({ imageUrl }) {
  const texture = useTexture(imageUrl);
  const meshRef = useRef();

  const [corners, setCorners] = useState([
    new THREE.Vector3(-2, 1.5, 0),  // Top-left
    new THREE.Vector3(2, 1.5, 0),   // Top-right
    new THREE.Vector3(2, -1.5, 0),  // Bottom-right
    new THREE.Vector3(-2, -1.5, 0), // Bottom-left
  ]);

  // Create a custom shader material for 2D perspective transformation
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        // We'll pass the corner positions as uniforms
        uCorners: {
          value: [
            new THREE.Vector2(-1, 1),   // UV for top-left (0,0 in UV is bottom-left in Three.js)
            new THREE.Vector2(1, 1),    // UV for top-right
            new THREE.Vector2(1, -1),   // UV for bottom-right
            new THREE.Vector2(-1, -1),  // UV for bottom-left
          ]
        },
        uTargetCorners: {
          value: corners.map(c => new THREE.Vector2(c.x / 2, c.y / 1.5)) // Normalize to [-1,1]
        }
      },
      // vertexShader: `
      //   varying vec2 vUv;
      //   uniform vec2 uCorners[4];
      //   uniform vec2 uTargetCorners[4];
        
      //   // Bilinear interpolation function
      //   vec2 bilinearInterpolation(vec2 uv, vec2[4] corners) {
      //     vec2 p0 = mix(corners[0], corners[1], uv.x);
      //     vec2 p1 = mix(corners[3], corners[2], uv.x);
      //     return mix(p0, p1, uv.y);
      //   }
        
      //   void main() {
      //     vUv = uv;
          
      //     // Get the normalized position in [-1,1] range
      //     vec2 normalizedPos = position.xy * vec2(0.5, 0.6667); // Convert from [-2,2]x[-1.5,1.5] to [-1,1]
          
      //     // Apply perspective transformation using bilinear interpolation
      //     vec2 transformedPos = bilinearInterpolation(normalizedPos * 0.5 + 0.5, uTargetCorners);
          
      //     // Convert back to world coordinates
      //     transformedPos = transformedPos * vec2(2.0, 1.5);
          
      //     gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPos.x, transformedPos.y, 0.0, 1.0);
      //   }
      // `
      vertexShader: `
  varying vec2 vUv;
  uniform vec2 uTargetCorners[4];
  
  vec2 bilinearInterpolation(vec2 uv, vec2[4] corners) {
    vec2 p0 = mix(corners[0], corners[1], uv.x);
    vec2 p1 = mix(corners[3], corners[2], uv.x);
    return mix(p0, p1, uv.y);
  }
  
  void main() {
    vUv = uv;
    
    // Bilinear interpolation
    vec2 pos = bilinearInterpolation(uv, uTargetCorners);
    
    // Convert from [0,1] to [-1,1]
    pos = pos * 2.0 - 1.0;
    
    // ✅ FIX: Flip Y-axis for Three.js coordinate system
    // gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);
    gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
  }
`
      ,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        
        void main() {
          gl_FragColor = texture2D(uTexture, vUv);
        }
      `,
      side: THREE.DoubleSide,
    });
  }, [texture]);

  // Update the shader uniforms when corners change
  useMemo(() => {
    if (material) {
      // Convert corners to normalized coordinates for the shader
      const targetCorners = corners.map(c =>
        new THREE.Vector2(c.x / 2, c.y / 1.5)
      );
      material.uniforms.uTargetCorners.value = targetCorners;

      // Force update
      material.uniformsNeedUpdate = true;
    }
  }, [corners, material]);

  const handleCornerDrag = (index, newPos) => {
    const updated = [...corners];
    updated[index] = newPos;
    setCorners(updated);
  };

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 3, 64, 64]} /> {/* High resolution for smooth deformation */}
        <primitive object={material} attach="material" />
      </mesh>

      {corners.map((corner, i) => (
        <Corner
          key={i}
          position={corner}
          onDrag={(pos) => handleCornerDrag(i, pos)}
        />
      ))}
    </>
  );
}

// Alternative: Using Three.js Matrix3 for perspective transformation
function ImagePlaneMatrix({ imageUrl }) {
  const texture = useTexture(imageUrl);
  const meshRef = useRef();
  const planeRef = useRef();

  const [corners, setCorners] = useState([
    new THREE.Vector3(-2, 1.5, 0),  // Top-left
    new THREE.Vector3(2, 1.5, 0),   // Top-right
    new THREE.Vector3(2, -1.5, 0),  // Bottom-right
    new THREE.Vector3(-2, -1.5, 0), // Bottom-left
  ]);

  // Calculate perspective matrix from 4 points
  const calculatePerspectiveMatrix = (src, dst) => {
    // Convert to arrays for easier math
    const srcArr = src.map(p => [p.x, p.y]);
    const dstArr = dst.map(p => [p.x, p.y]);

    // Calculate perspective transformation matrix
    // Using the method from: https://math.stackexchange.com/questions/494238/
    const A = [];
    const b = [];

    for (let i = 0; i < 4; i++) {
      const [x, y] = srcArr[i];
      const [u, v] = dstArr[i];

      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);

      b.push(u);
      b.push(v);
    }

    // Solve A * h = b for h (using Gaussian elimination for 8x8)
    // For simplicity, we'll use Three.js's Matrix4 to set up transformation
    // Alternative: Use a known library or implement proper matrix solving

    return new THREE.Matrix4();
  };

  // Update geometry based on corners
  useMemo(() => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position.array;

    // Original corners of the plane
    const originalCorners = [
      new THREE.Vector3(-2, 1.5, 0),
      new THREE.Vector3(2, 1.5, 0),
      new THREE.Vector3(2, -1.5, 0),
      new THREE.Vector3(-2, -1.5, 0),
    ];

    // For each vertex, calculate position using bilinear interpolation
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Normalize to [0,1] range
      const u = (x + 2) / 4;     // x from -2..2 to 0..1
      const v = (1.5 - y) / 3;   // y from 1.5..-1.5 to 0..1 (flipped)

      // Bilinear interpolation between corners
      const top = new THREE.Vector3().lerpVectors(corners[0], corners[1], u);
      const bottom = new THREE.Vector3().lerpVectors(corners[3], corners[2], u);
      const final = new THREE.Vector3().lerpVectors(top, bottom, v);

      positions[i] = final.x;
      positions[i + 1] = final.y;
      positions[i + 2] = final.z;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [corners]);

  const handleCornerDrag = (index, newPos) => {
    const updated = [...corners];
    updated[index] = newPos;
    setCorners(updated);
  };

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 3, 32, 32]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {corners.map((corner, i) => (
        <Corner
          key={i}
          position={corner}
          onDrag={(pos) => handleCornerDrag(i, pos)}
        />
      ))}
    </>
  );
}

export default function PerspectiveImageUploader() {
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ position: "absolute", zIndex: 10, top: 20, left: 20 }}
      />

      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={1} />
        {imageUrl && <ImagePlane imageUrl={imageUrl} />}
        <OrbitControls enableRotate={false} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}