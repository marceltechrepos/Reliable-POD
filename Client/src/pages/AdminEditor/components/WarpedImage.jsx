import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeWarpedImage = ({ src, corners, width, height, fit = "cover" }) => {
  const canvasRef = useRef(null);
  const [texture, setTexture] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(src, (loadedTexture) => {
      // ✅ IMPORTANT: Crisp text settings
      loadedTexture.minFilter = THREE.NearestFilter;
      loadedTexture.magFilter = THREE.NearestFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.generateMipmaps = false;

      // ✅ IMPORTANT: Texture ko flip mat karo
      loadedTexture.flipY = false; // <-- ADD THIS LINE

      setTexture(loadedTexture);
    });
  }, [src]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !texture || isInitialized) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uCorners: {
          value: [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1),
          ]
        },
        uTargetCorners: {
          value: corners.map(c =>
            new THREE.Vector2(c.x / width, c.y / height)
          )
        }
      },
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
    vec2 pos = bilinearInterpolation(uv, uTargetCorners);
    pos = pos * 2.0 - 1.0;
    gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);
  }
`,
      fragmentShader: `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  
  void main() {
    gl_FragColor = texture2D(uTexture, vUv);
  }
`,
      side: THREE.DoubleSide,
      transparent: true
    });

    // Create geometry
    const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Render
    renderer.render(scene, camera);
    setIsInitialized(true);

    // Cleanup
    return () => {
      if (renderer) {
        renderer.dispose();
      }
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture, isInitialized, width, height]);

  // Update when corners change
  useEffect(() => {
    if (!isInitialized || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = canvas.__threeRenderer;
    const scene = canvas.__threeScene;

    if (!renderer || !scene) return;

    // Find the mesh and update corners
    scene.traverse((child) => {
      if (child.isMesh && child.material.uniforms?.uTargetCorners) {
        child.material.uniforms.uTargetCorners.value =
          corners.map(c => new THREE.Vector2(c.x / width, c.y / height)); // ✅ NO 1 - 
        child.material.uniformsNeedUpdate = true;

        // Re-render
        const camera = canvas.__threeCamera;
        if (camera) {
          renderer.render(scene, camera);
        }
      }
    });
  }, [corners, width, height, isInitialized]);

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
        imageRendering: "pixelated",
      }}
    />
  );
};

export default ThreeWarpedImage;