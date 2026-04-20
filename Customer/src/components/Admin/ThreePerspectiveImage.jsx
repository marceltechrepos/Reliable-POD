
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeWarpedImage = ({ src, corners, width, height, fit = "cover" }) => {
  const canvasRef = useRef(null);
  const [texture, setTexture] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    
    const loader = new THREE.TextureLoader();
    loader.load(src, (loadedTexture) => {
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.flipY = false;
      setTexture(loadedTexture);
    });
  }, [src]);

  useEffect(() => {
    if (!canvasRef.current || !texture || isInitialized) return;
    if (width <= 0 || height <= 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const targetCorners = (corners && corners.length === 4) 
      ? corners.map(c => new THREE.Vector2(c.x / width, c.y / height))
      : [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(1, 0),
          new THREE.Vector2(1, 1),
          new THREE.Vector2(0, 1)
        ];

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTargetCorners: { value: targetCorners }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform vec2 uTargetCorners[4];
        
        vec2 bilinearInterpolation(vec2 uv, vec2 corners[4]) {
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

    const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    meshRef.current = mesh;

    renderer.render(scene, camera);
    setIsInitialized(true);

    return () => {
      if (renderer) renderer.dispose();
    };
  }, [texture, isInitialized, width, height]);

  useEffect(() => {
    if (!isInitialized || !meshRef.current) return;
    if (!corners || corners.length !== 4) return;

    const material = meshRef.current.material;
    if (material && material.uniforms && material.uniforms.uTargetCorners) {
      material.uniforms.uTargetCorners.value = corners.map(c => 
        new THREE.Vector2(c.x / width, c.y / height)
      );
      material.uniformsNeedUpdate = true;

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
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
        display: "block"
      }}
    />
  );
};

export default ThreeWarpedImage;