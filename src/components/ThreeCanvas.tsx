import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Expanded Full-Coverage Particle Wave Grid
    const countX = 95;
    const countY = 55;
    const particleCount = countX * countY;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    let i = 0;
    const spacingX = 0.75;
    const spacingY = 0.75;

    for (let ix = 0; ix < countX; ix++) {
      for (let iy = 0; iy < countY; iy++) {
        positions[i] = (ix - countX / 2) * spacingX; // x
        positions[i + 1] = (iy - countY / 2) * spacingY; // y
        positions[i + 2] = 0; // z
        scales[i / 3] = 1;
        i += 3;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Color depending on Theme
    let particleColor = 0x60a5fa; // Blue default for dark
    if (theme === 'light') particleColor = 0x2563eb; // Royal Blue for light

    const material = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.11,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3D Geometric Ring / Wireframe Core
    const ringGeo = new THREE.IcosahedronGeometry(4.8, 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: particleColor,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ringMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let count = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      count += 0.03;

      // Animate Particles Wave
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      let pIndex = 0;
      for (let ix = 0; ix < countX; ix++) {
        for (let iy = 0; iy < countY; iy++) {
          array[pIndex + 2] =
            Math.sin((ix + count) * 0.25) * 1.3 + Math.sin((iy + count) * 0.4) * 1.3;
          pIndex += 3;
        }
      }
      posAttr.needsUpdate = true;

      // Rotate 3D Core Ring smoothly
      ringMesh.rotation.x += 0.003;
      ringMesh.rotation.y += 0.005;

      // Camera Mouse Reaction
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
};
