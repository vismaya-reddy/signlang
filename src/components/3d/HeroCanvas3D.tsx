'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HeroCanvas3D({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software GL detection per guidelines
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080c1a, 0.08);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. Generate Biometric Landmark Constellation (21 landmark nodes in floating 3D space)
    const nodeCount = 42; // Two hand clusters
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodePositions: THREE.Vector3[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const accentNodeMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.95,
    });

    // Create 2 hand-like clouds
    for (let h = 0; h < 2; h++) {
      const offsetX = h === 0 ? -3.5 : 3.5;
      for (let i = 0; i < 21; i++) {
        // Natural distribution resembling hand joints
        const u = (i / 21) * Math.PI * 2;
        const radius = 1.2 + (i % 5) * 0.4;
        const x = offsetX + Math.cos(u) * radius + (Math.random() - 0.5) * 0.6;
        const y = Math.sin(u) * (radius * 0.9) + (Math.random() - 0.5) * 0.8;
        const z = ((i % 4) - 1.5) * 1.2 + (Math.random() - 0.5) * 0.5;

        const pos = new THREE.Vector3(x, y, z);
        nodePositions.push(pos);

        const mesh = new THREE.Mesh(sphereGeo, i % 4 === 0 ? accentNodeMat : nodeMat);
        mesh.position.copy(pos);
        nodesGroup.add(mesh);
      }
    }

    // Connect close neighbors with luminous kinetic lines
    const linePairs: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 1.8) {
          linePairs.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePairs.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePairs, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.35,
    });
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    nodesGroup.add(linesMesh);

    // Subtle ambient background particles
    const starCount = isSoftwareGl ? 80 : 220;
    const starGeo = new THREE.BufferGeometry();
    const starCoords: number[] = [];
    for (let i = 0; i < starCount; i++) {
      starCoords.push(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20 - 5
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Mouse listener
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function renderLoop() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      mouseRef.current.x = THREE.MathUtils.damp(mouseRef.current.x, mouseRef.current.targetX, 4, delta);
      mouseRef.current.y = THREE.MathUtils.damp(mouseRef.current.y, mouseRef.current.targetY, 4, delta);

      // Rotate nodes constellation
      nodesGroup.rotation.y = elapsed * 0.15 + mouseRef.current.x * 0.4;
      nodesGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.1 - mouseRef.current.y * 0.3;
      nodesGroup.position.y = Math.sin(elapsed * 0.8) * 0.25;

      // Slow drift stars
      starField.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        frameId = window.setTimeout(renderLoop, 80);
      } else {
        frameId = requestAnimationFrame(renderLoop);
      }
    }

    renderLoop();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) clearTimeout(frameId);
      else cancelAnimationFrame(frameId);
      sphereGeo.dispose();
      linesGeo.dispose();
      starGeo.dispose();
      nodeMat.dispose();
      accentNodeMat.dispose();
      linesMat.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 w-full h-full overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
export default HeroCanvas3D;
