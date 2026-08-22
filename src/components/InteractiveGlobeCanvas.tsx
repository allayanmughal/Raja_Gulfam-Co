import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const InteractiveGlobeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3D Sphere Wireframe + Nodes
    const sphereGeo = new THREE.SphereGeometry(3.5, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(globe);

    // Outer Ring Orbit
    const ringGeo = new THREE.RingGeometry(4.2, 4.3, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Interactive Mouse Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      globe.rotation.y += deltaMove.x * 0.008;
      globe.rotation.x += deltaMove.y * 0.008;
      ring.rotation.z += deltaMove.x * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        globe.rotation.y += 0.004;
        ring.rotation.z += 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-64 cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
      <p className="text-[10px] text-center opacity-60 mt-[-20px] font-mono pointer-events-none">
        💡 Drag to rotate 3D Global Jurisdiction Globe
      </p>
    </div>
  );
};
