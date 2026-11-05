'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, ZoomIn, Layers, Sparkles, Sliders } from 'lucide-react';

interface HandPoseConfig {
  name: string;
  thumb: [number, number, number]; // curl angles for 3 segments (radians)
  index: [number, number, number];
  middle: [number, number, number];
  ring: [number, number, number];
  pinky: [number, number, number];
  spread?: [number, number, number, number, number]; // splay (Y rotation)
  wristRotation?: [number, number, number];
  secondHandActive?: boolean; // For two-handed ISL visualization
}

// Preset poses mapped to key ISL letter shapes
const POSE_LIBRARY: Record<string, HandPoseConfig> = {
  // Neutral relaxed hand
  neutral: {
    name: 'Neutral Relaxed',
    thumb: [0.1, 0.1, 0.1],
    index: [0.2, 0.2, 0.15],
    middle: [0.25, 0.25, 0.2],
    ring: [0.3, 0.3, 0.25],
    pinky: [0.35, 0.35, 0.3],
    spread: [-0.2, 0.05, 0, -0.05, -0.1],
    wristRotation: [0, 0, 0],
  },
  // Vowel A (Dominant index touches non-dominant thumb)
  A: {
    name: 'ISL Letter A (Thumb touch)',
    thumb: [0.2, 0.1, 0.05],
    index: [0.05, 0.05, 0.05], // pointing straight to touch thumb
    middle: [1.4, 1.3, 1.1],
    ring: [1.4, 1.3, 1.1],
    pinky: [1.4, 1.3, 1.1],
    spread: [-0.3, 0.1, 0, 0, 0],
    wristRotation: [0.1, -0.2, 0.1],
    secondHandActive: true,
  },
  // Letter B (Both hands create double loop / flat index & middle)
  B: {
    name: 'ISL Letter B (Two Circles)',
    thumb: [0.8, 0.6, 0.4],
    index: [0.9, 0.8, 0.7],
    middle: [0.1, 0.1, 0.1],
    ring: [0.1, 0.1, 0.1],
    pinky: [0.1, 0.1, 0.1],
    spread: [-0.1, 0.05, 0.05, 0, -0.05],
    wristRotation: [0, 0, 0],
    secondHandActive: true,
  },
  // Letter C (Curved hand shape)
  C: {
    name: 'ISL Letter C (Curved Arc)',
    thumb: [0.5, 0.4, 0.3],
    index: [0.6, 0.5, 0.4],
    middle: [0.6, 0.5, 0.4],
    ring: [0.6, 0.5, 0.4],
    pinky: [0.6, 0.5, 0.4],
    spread: [-0.1, 0.02, 0, -0.02, -0.04],
    wristRotation: [0, -0.4, 0],
  },
  // Letter D (Dominant index touches non-dominant thumb and index)
  D: {
    name: 'ISL Letter D',
    thumb: [0.5, 0.3, 0.2],
    index: [0.0, 0.0, 0.0],
    middle: [1.4, 1.4, 1.2],
    ring: [1.4, 1.4, 1.2],
    pinky: [1.4, 1.4, 1.2],
    spread: [-0.3, 0, 0, 0, 0],
    wristRotation: [0, 0, 0],
  },
  // Vowel E (Touch index tip)
  E: {
    name: 'ISL Letter E (Index Touch)',
    thumb: [0.2, 0.1, 0.1],
    index: [0.0, 0.0, 0.0],
    middle: [1.3, 1.3, 1.1],
    ring: [1.3, 1.3, 1.1],
    pinky: [1.3, 1.3, 1.1],
    wristRotation: [0, -0.1, 0],
    secondHandActive: true,
  },
  // Open Palm / Hello
  HELLO: {
    name: 'Greeting / Open Palm',
    thumb: [0.1, 0.05, 0.05],
    index: [0.0, 0.0, 0.0],
    middle: [0.0, 0.0, 0.0],
    ring: [0.0, 0.0, 0.0],
    pinky: [0.0, 0.0, 0.0],
    spread: [-0.3, 0.08, 0, -0.08, -0.15],
    wristRotation: [0, 0, 0.1],
  },
  // Fist / YES
  YES: {
    name: 'Fist Nod / Affirmatory',
    thumb: [0.9, 0.7, 0.5],
    index: [1.5, 1.4, 1.2],
    middle: [1.5, 1.4, 1.2],
    ring: [1.5, 1.4, 1.2],
    pinky: [1.5, 1.4, 1.2],
    spread: [-0.1, 0, 0, 0, 0],
    wristRotation: [0.3, 0, 0],
  },
  // Pointing / YOU
  YOU: {
    name: 'Direct Pointing',
    thumb: [0.8, 0.5, 0.3],
    index: [0.0, 0.0, 0.0],
    middle: [1.5, 1.4, 1.2],
    ring: [1.5, 1.4, 1.2],
    pinky: [1.5, 1.4, 1.2],
    spread: [-0.1, 0, 0, 0, 0],
    wristRotation: [-0.3, 0.2, 0],
  },
};

interface HandSign3DProps {
  currentSign?: string;
  accentColor?: string;
  showControls?: boolean;
  className?: string;
  interactive?: boolean;
}

export function HandSign3D({
  currentSign = 'A',
  accentColor = '#6366f1',
  showControls = true,
  className = '',
  interactive = true,
}: HandSign3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [skinStyle, setSkinStyle] = useState<'hologram' | 'anatomical' | 'cyber'>('hologram');
  const [viewAngle, setViewAngle] = useState<'front' | 'side' | 'top' | 'isometric'>('front');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);

  // References for scene manipulation
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    handGroup: THREE.Group;
    secondHandGroup?: THREE.Group;
    fingerBones: Record<string, THREE.Group[]>;
    materials: THREE.Material[];
    targetJointAngles: HandPoseConfig;
    currentJointAngles: HandPoseConfig;
  } | null>(null);

  // Pointer drag state
  const dragRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotX: 0.1,
    rotY: 0.0,
    zoom: 4.8,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per directives
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

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1021, 0.12);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.5, dragRef.current.zoom);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting Rig (3-point warm/cool)
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Ground contact shadow circle
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.6;
    scene.add(shadowMesh);

    // Materials registry
    const materials: THREE.Material[] = [];

    const getPrimaryMaterial = (style: 'hologram' | 'anatomical' | 'cyber') => {
      let mat: THREE.Material;
      if (style === 'hologram') {
        mat = new THREE.MeshPhysicalMaterial({
          color: 0x6366f1,
          emissive: 0x312e81,
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.8,
          clearcoat: 0.8,
          wireframe: wireframeMode,
        });
      } else if (style === 'cyber') {
        mat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.15,
          metalness: 0.9,
          wireframe: wireframeMode,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: 0xf5d0b5,
          roughness: 0.65,
          metalness: 0.05,
          wireframe: wireframeMode,
        });
      }
      materials.push(mat);
      return mat;
    };

    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: wireframeMode,
    });
    materials.push(jointMat);

    // 4. Construct Articulated Procedural Hand (THREE.Group hierarchy)
    function buildHand(isLeft = false) {
      const hand = new THREE.Group();
      const bones: Record<string, THREE.Group[]> = {
        thumb: [],
        index: [],
        middle: [],
        ring: [],
        pinky: [],
      };

      const signMult = isLeft ? -1 : 1;
      const handMat = getPrimaryMaterial(skinStyle);

      // Wrist base
      const wristGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.6, 16);
      const wristMesh = new THREE.Mesh(wristGeo, handMat);
      wristMesh.position.y = -0.9;
      hand.add(wristMesh);

      // Palm plate
      const palmGeo = new THREE.BoxGeometry(0.78, 0.9, 0.28);
      const palmMesh = new THREE.Mesh(palmGeo, handMat);
      palmMesh.position.set(0, -0.2, 0);
      hand.add(palmMesh);

      // Helper to create an articulated finger with 3 phalanges & joints
      const createFinger = (
        name: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky',
        baseX: number,
        baseY: number,
        baseZ: number,
        lengths: [number, number, number],
        thickness: number
      ) => {
        const fingerBonesList: THREE.Group[] = [];

        // Base knuckle joint
        const knuckleGeo = new THREE.SphereGeometry(thickness * 1.15, 12, 12);
        const knuckle = new THREE.Mesh(knuckleGeo, jointMat);
        knuckle.position.set(baseX * signMult, baseY, baseZ);
        hand.add(knuckle);

        // Segment 1 (Proximal)
        const seg1Group = new THREE.Group();
        seg1Group.position.set(baseX * signMult, baseY, baseZ);
        hand.add(seg1Group);

        const p1Geo = new THREE.CylinderGeometry(thickness * 0.9, thickness, lengths[0], 12);
        p1Geo.translate(0, lengths[0] / 2, 0);
        const p1Mesh = new THREE.Mesh(p1Geo, handMat);
        seg1Group.add(p1Mesh);

        // Segment 2 (Intermediate)
        const seg2Group = new THREE.Group();
        seg2Group.position.set(0, lengths[0], 0);
        seg1Group.add(seg2Group);

        const j2Geo = new THREE.SphereGeometry(thickness * 0.95, 12, 12);
        const j2Mesh = new THREE.Mesh(j2Geo, jointMat);
        seg2Group.add(j2Mesh);

        const p2Geo = new THREE.CylinderGeometry(thickness * 0.8, thickness * 0.9, lengths[1], 12);
        p2Geo.translate(0, lengths[1] / 2, 0);
        const p2Mesh = new THREE.Mesh(p2Geo, handMat);
        seg2Group.add(p2Mesh);

        // Segment 3 (Distal / Fingertip)
        const seg3Group = new THREE.Group();
        seg3Group.position.set(0, lengths[1], 0);
        seg2Group.add(seg3Group);

        const j3Geo = new THREE.SphereGeometry(thickness * 0.85, 12, 12);
        const j3Mesh = new THREE.Mesh(j3Geo, jointMat);
        seg3Group.add(j3Mesh);

        const p3Geo = new THREE.CylinderGeometry(thickness * 0.65, thickness * 0.8, lengths[2], 12);
        p3Geo.translate(0, lengths[2] / 2, 0);
        const p3Mesh = new THREE.Mesh(p3Geo, handMat);
        seg3Group.add(p3Mesh);

        // Fingertip cap
        const tipGeo = new THREE.SphereGeometry(thickness * 0.65, 12, 12);
        const tipMesh = new THREE.Mesh(tipGeo, jointMat);
        tipMesh.position.set(0, lengths[2], 0);
        seg3Group.add(tipMesh);

        fingerBonesList.push(seg1Group, seg2Group, seg3Group);
        bones[name] = fingerBonesList;
      };

      // Construct digits with realistic proportions
      // Thumb
      createFinger('thumb', -0.42, -0.4, 0.12, [0.38, 0.32, 0.28], 0.12);
      // Index
      createFinger('index', -0.28, 0.26, 0.0, [0.44, 0.32, 0.26], 0.105);
      // Middle
      createFinger('middle', -0.09, 0.28, 0.0, [0.48, 0.36, 0.28], 0.11);
      // Ring
      createFinger('ring', 0.1, 0.26, 0.0, [0.42, 0.32, 0.25], 0.10);
      // Pinky
      createFinger('pinky', 0.28, 0.21, 0.0, [0.34, 0.26, 0.22], 0.088);

      return { hand, bones };
    }

    const dominantHand = buildHand(false);
    dominantHand.hand.position.set(0, -0.2, 0);
    scene.add(dominantHand.hand);

    // Non-dominant hand for two-handed ISL representations (vowels & complex signs)
    const nonDominantHand = buildHand(true);
    nonDominantHand.hand.position.set(-1.1, -0.4, -0.2);
    nonDominantHand.hand.rotation.set(0.2, 0.6, -0.15);
    scene.add(nonDominantHand.hand);

    const initialPose = POSE_LIBRARY[currentSign.toUpperCase()] || POSE_LIBRARY.A || POSE_LIBRARY.neutral;

    sceneRef.current = {
      scene,
      camera,
      renderer,
      handGroup: dominantHand.hand,
      secondHandGroup: nonDominantHand.hand,
      fingerBones: dominantHand.bones,
      materials,
      targetJointAngles: initialPose,
      currentJointAngles: JSON.parse(JSON.stringify(initialPose)),
    };

    // 5. Render loop with Software GL safeguard
    let frameId = 0;
    const clock = new THREE.Clock();

    function animate() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (sceneRef.current) {
        const { handGroup, secondHandGroup, fingerBones, targetJointAngles, currentJointAngles } =
          sceneRef.current;

        // Auto slow rotation if enabled and not manually dragging
        if (isRotating && !dragRef.current.isDragging) {
          dragRef.current.rotY += delta * 0.4;
        }

        // Smooth spring damping for hand orientation
        handGroup.rotation.y = THREE.MathUtils.damp(
          handGroup.rotation.y,
          dragRef.current.rotY + (targetJointAngles.wristRotation?.[1] || 0),
          6,
          delta
        );
        handGroup.rotation.x = THREE.MathUtils.damp(
          handGroup.rotation.x,
          dragRef.current.rotX + (targetJointAngles.wristRotation?.[0] || 0),
          6,
          delta
        );
        handGroup.rotation.z = THREE.MathUtils.damp(
          handGroup.rotation.z,
          targetJointAngles.wristRotation?.[2] || 0,
          6,
          delta
        );

        // Smoothly interpolate joint angles toward target pose
        const digits: Array<'thumb' | 'index' | 'middle' | 'ring' | 'pinky'> = [
          'thumb',
          'index',
          'middle',
          'ring',
          'pinky',
        ];

        digits.forEach((digit, idx) => {
          const bones = fingerBones[digit];
          if (!bones) return;

          const targetCurls = targetJointAngles[digit] || [0, 0, 0];
          const currentCurls = currentJointAngles[digit];

          // Bone 0 (proximal)
          currentCurls[0] = THREE.MathUtils.damp(currentCurls[0], targetCurls[0], 8, delta);
          bones[0].rotation.x = currentCurls[0];

          // Bone 1 (intermediate)
          currentCurls[1] = THREE.MathUtils.damp(currentCurls[1], targetCurls[1], 8, delta);
          bones[1].rotation.x = currentCurls[1];

          // Bone 2 (distal)
          currentCurls[2] = THREE.MathUtils.damp(currentCurls[2], targetCurls[2], 8, delta);
          bones[2].rotation.x = currentCurls[2];

          // Optional spread / splay
          if (targetJointAngles.spread) {
            bones[0].rotation.z = targetJointAngles.spread[idx] || 0;
          }
        });

        // Subtle biological breathing motion
        const breathe = Math.sin(elapsed * 2) * 0.02;
        handGroup.position.y = -0.2 + breathe;

        // Toggle visibility of second hand if ISL sign requires it
        if (secondHandGroup) {
          const isTwoHanded = Boolean(targetJointAngles.secondHandActive);
          secondHandGroup.visible = isTwoHanded;
          if (isTwoHanded) {
            secondHandGroup.position.y = -0.3 + Math.sin(elapsed * 2 + 0.5) * 0.02;
          }
        }

        // Camera distance smooth zoom
        camera.position.z = THREE.MathUtils.damp(camera.position.z, dragRef.current.zoom, 8, delta);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        // Safe paced rendering on headless / software GL
        frameId = window.setTimeout(animate, 80);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    }

    animate();

    // Resize handler
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
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) clearTimeout(frameId);
      else cancelAnimationFrame(frameId);
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []); // Run once on mount

  // Update target pose when currentSign changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const poseKey = currentSign.toUpperCase();
    const pose = POSE_LIBRARY[poseKey] || POSE_LIBRARY.neutral;
    sceneRef.current.targetJointAngles = pose;
  }, [currentSign]);

  // Pointer drag controls for 3D inspection
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    dragRef.current.isDragging = true;
    dragRef.current.prevX = e.clientX;
    dragRef.current.prevY = e.clientY;
    setIsRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.prevX;
    const dy = e.clientY - dragRef.current.prevY;
    dragRef.current.rotY += dx * 0.01;
    dragRef.current.rotX = Math.max(-0.6, Math.min(0.6, dragRef.current.rotX + dy * 0.01));
    dragRef.current.prevX = e.clientX;
    dragRef.current.prevY = e.clientY;
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    dragRef.current.zoom = Math.max(3.2, Math.min(6.5, dragRef.current.zoom + e.deltaY * 0.003));
  };

  const setPresetAngle = (angle: 'front' | 'side' | 'top' | 'isometric') => {
    setViewAngle(angle);
    setIsRotating(false);
    if (angle === 'front') {
      dragRef.current.rotX = 0.05;
      dragRef.current.rotY = 0;
    } else if (angle === 'side') {
      dragRef.current.rotX = 0;
      dragRef.current.rotY = Math.PI / 2;
    } else if (angle === 'top') {
      dragRef.current.rotX = -0.55;
      dragRef.current.rotY = 0;
    } else if (angle === 'isometric') {
      dragRef.current.rotX = 0.25;
      dragRef.current.rotY = 0.65;
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[340px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950/80 via-[#0B1021] to-slate-950 border border-slate-800/80 select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top minimal spec badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-[11px] font-mono text-cyan-400 font-semibold tracking-wider uppercase">
          ISL 3D Anatomy · {currentSign}
        </div>
        <div className="px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* Collapsible Bottom Control Dock (Directive 5 compliant: zero viewport occlusion) */}
      {showControls && (
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[580px] transition-all duration-300 ${
            hudCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
          }`}
        >
          {/* Collapse Toggle Handle */}
          <div className="flex justify-center -mb-px">
            <button
              onClick={() => setHudCollapsed(!hudCollapsed)}
              className="px-3 py-1 rounded-t-lg bg-slate-900/95 border-t border-x border-slate-700/80 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1.5 backdrop-blur-md shadow-lg"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>{hudCollapsed ? 'Show 3D Viewport Controls' : 'Hide Controls'}</span>
            </button>
          </div>

          {/* Unified Dock Container */}
          <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* View angle buttons */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Angle:</span>
              {(['front', 'side', 'top', 'isometric'] as const).map((ang) => (
                <button
                  key={ang}
                  onClick={() => setPresetAngle(ang)}
                  className={`px-2 py-1 rounded text-[11px] capitalize font-medium transition-colors ${
                    viewAngle === ang
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ang}
                </button>
              ))}
            </div>

            {/* Actions: Auto-rotate, Wireframe toggle */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => setIsRotating(!isRotating)}
                title="Toggle continuous turntable rotation"
                className={`p-1.5 rounded transition-colors ${
                  isRotating
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  dragRef.current.zoom = 4.8;
                  dragRef.current.rotX = 0.1;
                  dragRef.current.rotY = 0;
                  setViewAngle('front');
                }}
                title="Reset Camera"
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HandSign3D;
