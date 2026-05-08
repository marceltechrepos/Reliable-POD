import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeWarpedImage = ({ src, corners, width, height, fit = "cover", opacity = 1 }) => {
  const canvasRef = useRef(null);
  const [texture, setTexture] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const loadedTexture = new THREE.Texture(img);
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.flipY = false;
      loadedTexture.needsUpdate = true;
      setTexture(loadedTexture);
    };
    img.src = src;
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
        uTargetCorners: { value: targetCorners },
        uOpacity: { value: opacity },
        uTextureAspect: { value: texture.image ? (texture.image.width / texture.image.height) : 1.0 },
        uQuadAspect: { value: width / height },
        uFitType: { value: fit === 'contain' ? 2.0 : (fit === 'cover' ? 1.0 : 0.0) }
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
        uniform float uOpacity;
        uniform float uTextureAspect;
        uniform float uQuadAspect;
        uniform float uFitType;
        
        void main() {
          vec2 uv = vUv;
          
          if (uFitType > 0.5) { // Cover (1.0) or Contain (2.0)
            float ratio = uQuadAspect / uTextureAspect;
            if ((uFitType == 1.0 && ratio > 1.0) || (uFitType == 2.0 && ratio < 1.0)) {
              // Quad is wider than texture relative to its aspect, so scale y
              float scale = 1.0 / ratio;
              uv.y = (uv.y - 0.5) * scale + 0.5;
            } else {
              // Quad is taller than texture relative to its aspect, so scale x
              uv.x = (uv.x - 0.5) * ratio + 0.5;
            }
          }
          
          // Discard pixels outside the texture boundaries if it's contain or if we scale outside
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
             gl_FragColor = vec4(0.0);
          } else {
             vec4 texColor = texture2D(uTexture, uv);
             gl_FragColor = vec4(texColor.rgb, texColor.a * uOpacity);
          }
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
    
    const material = meshRef.current.material;
    if (material && material.uniforms) {
      // Update corners
      if (corners && corners.length === 4) {
        material.uniforms.uTargetCorners.value = corners.map(c => 
          new THREE.Vector2(c.x / width, c.y / height)
        );
      }
      
      // Update opacity
      material.uniforms.uOpacity.value = opacity;
      
      // Update aspect ratio and fit
      material.uniforms.uQuadAspect.value = width / height;
      material.uniforms.uFitType.value = fit === 'contain' ? 2.0 : (fit === 'cover' ? 1.0 : 0.0);
      
      material.uniformsNeedUpdate = true;

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
  }, [corners, width, height, opacity, fit, isInitialized]);


  return (
    <>
      <img src={src} crossOrigin="anonymous" style={{ display: "none" }} alt="preload" />
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
    </>
  );
};

export default ThreeWarpedImage;