"use client";

import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function ShoeViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // UI State
  const [upperColor, setUpperColor] = React.useState("#2563eb");
  const [soleColor, setSoleColor] = React.useState("#f8fafc");
  const [laceColor, setLaceColor] = React.useState("#0f172a");
  const [midsoleColor, setMidsoleColor] = React.useState("#e2e8f0");
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [showShadows, setShowShadows] = React.useState(true);

  // Three.js refs
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const shoeGroupRef = React.useRef<THREE.Group | null>(null);
  const animationIdRef = React.useRef<number>(0);

  // Material refs for live color updates
  const upperMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const soleMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const laceMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const midsoleMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);

  // Camera presets
  const cameraPresets = {
    side: new THREE.Vector3(3.8, 1.8, 3.2),
    front: new THREE.Vector3(0, 1.5, 5.5),
    back: new THREE.Vector3(0, 1.8, -5.2),
    top: new THREE.Vector3(0, 6, 0.1),
    threeQuarter: new THREE.Vector3(3.2, 2.2, 3.8),
  };

  const [targetCamPos, setTargetCamPos] = React.useState<THREE.Vector3 | null>(null);

  // ========== INIT THREE.JS ==========
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.028);
    sceneRef.current = scene;

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    camera.position.copy(cameraPresets.side);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.5;
    controls.maxDistance = 12;
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI - 0.1;
    controls.target.set(0, 0.4, 0);
    controlsRef.current = controls;

    // 5. Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 9, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.4, 14);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.9);
    bottomLight.position.set(0, -6, 2);
    scene.add(bottomLight);

    // 6. Shadow floor
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.55;
    floor.receiveShadow = true;
    scene.add(floor);

    // ========== BUILD PROCEDURAL SHOE ==========
    const shoeGroup = new THREE.Group();
    shoeGroup.position.y = 0.15;
    scene.add(shoeGroup);
    shoeGroupRef.current = shoeGroup;

    // Materials
    const upperMat = new THREE.MeshStandardMaterial({
      color: upperColor,
      roughness: 0.45,
      metalness: 0.05,
    });
    upperMatRef.current = upperMat;

    const soleMat = new THREE.MeshStandardMaterial({
      color: soleColor,
      roughness: 0.7,
      metalness: 0.0,
    });
    soleMatRef.current = soleMat;

    const midsoleMat = new THREE.MeshStandardMaterial({
      color: midsoleColor,
      roughness: 0.55,
      metalness: 0.02,
    });
    midsoleMatRef.current = midsoleMat;

    const laceMat = new THREE.MeshStandardMaterial({
      color: laceColor,
      roughness: 0.6,
      metalness: 0.0,
    });
    laceMatRef.current = laceMat;

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.1,
    });

    // --- Sole (bottom) ---
    const soleGeo = new THREE.BoxGeometry(2.6, 0.28, 1.05);
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.set(0, -0.35, 0);
    sole.castShadow = true;
    sole.receiveShadow = true;
    shoeGroup.add(sole);

    // --- Midsole ---
    const midGeo = new THREE.BoxGeometry(2.55, 0.22, 1.0);
    const midsole = new THREE.Mesh(midGeo, midsoleMat);
    midsole.position.set(0, -0.12, 0);
    midsole.castShadow = true;
    shoeGroup.add(midsole);

    // --- Upper body (main shell) ---
    const upperGeo = new THREE.BoxGeometry(2.35, 0.85, 0.95);
    const upper = new THREE.Mesh(upperGeo, upperMat);
    upper.position.set(0.05, 0.35, 0);
    upper.castShadow = true;
    shoeGroup.add(upper);

    // --- Toe box (slightly rounded feel) ---
    const toeGeo = new THREE.BoxGeometry(0.55, 0.7, 0.95);
    const toe = new THREE.Mesh(toeGeo, upperMat);
    toe.position.set(1.15, 0.28, 0);
    toe.castShadow = true;
    shoeGroup.add(toe);

    // --- Heel counter ---
    const heelGeo = new THREE.BoxGeometry(0.55, 0.95, 0.98);
    const heel = new THREE.Mesh(heelGeo, accentMat);
    heel.position.set(-1.05, 0.4, 0);
    heel.castShadow = true;
    shoeGroup.add(heel);

    // --- Tongue ---
    const tongueGeo = new THREE.BoxGeometry(0.9, 0.55, 0.65);
    const tongue = new THREE.Mesh(tongueGeo, upperMat);
    tongue.position.set(0.15, 0.85, 0);
    tongue.castShadow = true;
    shoeGroup.add(tongue);

    // --- Laces (simple cylinders) ---
    const lacePositions = [
      [0.55, 0.78, 0.32],
      [0.35, 0.82, 0.32],
      [0.15, 0.85, 0.32],
      [-0.05, 0.85, 0.32],
      [0.55, 0.78, -0.32],
      [0.35, 0.82, -0.32],
      [0.15, 0.85, -0.32],
      [-0.05, 0.85, -0.32],
    ];

    lacePositions.forEach(([x, y, z]) => {
      const laceGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12);
      const lace = new THREE.Mesh(laceGeo, laceMat);
      lace.rotation.z = Math.PI / 2;
      lace.position.set(x, y, z);
      lace.castShadow = true;
      shoeGroup.add(lace);
    });

    // Cross laces
    const crossLace1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10),
      laceMat
    );
    crossLace1.rotation.z = Math.PI / 2.8;
    crossLace1.position.set(0.25, 0.82, 0);
    shoeGroup.add(crossLace1);

    const crossLace2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.7, 10),
      laceMat
    );
    crossLace2.rotation.z = -Math.PI / 2.8;
    crossLace2.position.set(0.25, 0.82, 0);
    shoeGroup.add(crossLace2);

    // --- Logo badge ---
    const logoGeo = new THREE.BoxGeometry(0.35, 0.25, 0.04);
    const logoMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.2,
    });
    const logo = new THREE.Mesh(logoGeo, logoMat);
    logo.position.set(0.6, 0.45, 0.49);
    shoeGroup.add(logo);

    // ========== ANIMATION LOOP ==========
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && shoeGroupRef.current) {
        shoeGroupRef.current.rotation.y += 0.005;
      }

      if (targetCamPos && cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPos, 0.07);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ========== RESIZE ==========
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ========== CLEANUP ==========
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationIdRef.current);
      controls.dispose();
      renderer.dispose();
      // Dispose geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      container.innerHTML = "";
    };
  }, []); // only once

  // ========== LIVE COLOR UPDATES ==========
  React.useEffect(() => {
    if (upperMatRef.current) {
      upperMatRef.current.color.set(upperColor);
      upperMatRef.current.needsUpdate = true;
    }
  }, [upperColor]);

  React.useEffect(() => {
    if (soleMatRef.current) {
      soleMatRef.current.color.set(soleColor);
      soleMatRef.current.needsUpdate = true;
    }
  }, [soleColor]);

  React.useEffect(() => {
    if (laceMatRef.current) {
      laceMatRef.current.color.set(laceColor);
      laceMatRef.current.needsUpdate = true;
    }
  }, [laceColor]);

  React.useEffect(() => {
    if (midsoleMatRef.current) {
      midsoleMatRef.current.color.set(midsoleColor);
      midsoleMatRef.current.needsUpdate = true;
    }
  }, [midsoleColor]);

  // ========== UI HANDLERS ==========
  const setCameraView = (view: keyof typeof cameraPresets) => {
    setTargetCamPos(cameraPresets[view].clone());
    setTimeout(() => setTargetCamPos(null), 1200);
  };

  const takeScreenshot = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const link = document.createElement("a");
    link.download = "sneaker-config.png";
    link.href = renderer.domElement.toDataURL("image/png");
    link.click();
  };

  const resetAll = () => {
    setUpperColor("#2563eb");
    setSoleColor("#f8fafc");
    setLaceColor("#0f172a");
    setMidsoleColor("#e2e8f0");
    setAutoRotate(true);
    setCameraView("side");
    if (shoeGroupRef.current) {
      shoeGroupRef.current.rotation.y = 0;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 3D Canvas */}
      <div className="flex-1">
        <div
          ref={containerRef}
          className="w-full h-[520px] md:h-[650px] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Controls Panel */}
      <div className="w-full lg:w-80 space-y-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Customize</h2>

        {/* Colors */}
        <div className="space-y-3">
          <ColorRow label="Upper" value={upperColor} onChange={setUpperColor} />
          <ColorRow label="Sole" value={soleColor} onChange={setSoleColor} />
          <ColorRow label="Midsole" value={midsoleColor} onChange={setMidsoleColor} />
          <ColorRow label="Laces" value={laceColor} onChange={setLaceColor} />
        </div>

        {/* Camera Presets */}
        <div>
          <p className="text-sm text-zinc-400 mb-2">Camera View</p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["side", "Side"],
                ["front", "Front"],
                ["back", "Back"],
                ["top", "Top"],
                ["threeQuarter", "3/4"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCameraView(key)}
                className="px-2 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Auto Rotate</span>
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              autoRotate ? "bg-blue-600" : "bg-zinc-700"
            }`}
          >
            {autoRotate ? "ON" : "OFF"}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={takeScreenshot}
            className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm transition"
          >
            📷 Screenshot
          </button>
          <button
            onClick={resetAll}
            className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm transition"
          >
            ↺ Reset
          </button>
        </div>

        <p className="text-xs text-zinc-500 pt-2">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </div>
  );
}

// Small helper component for color pickers
function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
        />
        <span className="text-xs text-zinc-500 font-mono w-16">{value}</span>
      </div>
    </div>
  );
}