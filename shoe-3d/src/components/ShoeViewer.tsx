"use client";

import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function ShoeViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // UI State
  const [color, setColor] = React.useState("#ffffff");
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Three.js refs
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const modelRef = React.useRef<THREE.Group | null>(null);
  const materialsRef = React.useRef<THREE.MeshStandardMaterial[]>([]);
  const animationIdRef = React.useRef<number>(0);

  // Camera presets
  const cameraPresets = {
    side: new THREE.Vector3(2.8, 1.4, 2.6),
    front: new THREE.Vector3(0, 1.2, 4.2),
    back: new THREE.Vector3(0, 1.4, -4.0),
    top: new THREE.Vector3(0, 4.5, 0.1),
    threeQuarter: new THREE.Vector3(2.4, 1.7, 2.8),
  };

  const [targetCamPos, setTargetCamPos] = React.useState<THREE.Vector3 | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ========== SCENE ==========
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18181b);
    scene.fog = new THREE.FogExp2(0x18181b, 0.02);

    // ========== CAMERA ==========
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.copy(cameraPresets.side);
    cameraRef.current = camera;

    // ========== RENDERER ==========
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========== CONTROLS ==========
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.8;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI - 0.1;
    controls.target.set(0, 0.3, 0);
    controlsRef.current = controls;

    // ========== LIGHTS ==========
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 1.2, 15);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.6);
    bottomLight.position.set(0, -4, 2);
    scene.add(bottomLight);

    // ========== FLOOR ==========
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // ========== LOAD YOUR GLB MODEL ==========
    const loader = new GLTFLoader();

    loader.load(
      "/textures/models/Meshy_AI_Frosted_Aurora_biped_Animation_Running_withSkin.glb", // ← your file path
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center); // center it
        model.position.y += size.y / 2; // sit on the floor

        // Auto scale if the model is too big or too small
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        model.scale.setScalar(scale);

        // Enable shadows + collect materials
        const materials: THREE.MeshStandardMaterial[] = [];
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              // Convert to MeshStandardMaterial if needed
              if (!(child.material instanceof THREE.MeshStandardMaterial)) {
                const oldMat = child.material as THREE.Material;
                const newMat = new THREE.MeshStandardMaterial({
                  color: 0xffffff,
                  roughness: 0.5,
                  metalness: 0.05,
                });
                // Copy texture if exists
                if ((oldMat as any).map) {
                  newMat.map = (oldMat as any).map;
                }
                child.material = newMat;
              }
              materials.push(child.material as THREE.MeshStandardMaterial);
            }
          }
        });

        materialsRef.current = materials;
        scene.add(model);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error loading model:", err);
        setError("Failed to load shoe.glb. Check the file path.");
        setLoading(false);
      }
    );

    // ========== ANIMATION LOOP ==========
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && modelRef.current) {
        modelRef.current.rotation.y += 0.004;
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
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
      container.innerHTML = "";
    };
  }, []);

  // Live color change
  React.useEffect(() => {
    materialsRef.current.forEach((mat) => {
      mat.color.set(color);
      mat.needsUpdate = true;
    });
  }, [color]);

  // Handlers
  const setCameraView = (view: keyof typeof cameraPresets) => {
    setTargetCamPos(cameraPresets[view].clone());
    setTimeout(() => setTargetCamPos(null), 1100);
  };

  const takeScreenshot = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const link = document.createElement("a");
    link.download = "my-shoe.png";
    link.href = renderer.domElement.toDataURL("image/png");
    link.click();
  };

  const resetAll = () => {
    setColor("#ffffff");
    setAutoRotate(true);
    setCameraView("side");
    if (modelRef.current) modelRef.current.rotation.y = 0;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="w-full h-[520px] md:h-[650px] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-grab active:cursor-grabbing"
        />

        {/* Loading / Error overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 rounded-2xl">
            <p className="text-zinc-300 text-lg">Loading your shoe model...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 rounded-2xl">
            <p className="text-red-400 text-center px-4">{error}</p>
          </div>
        )}
      </div>

      {/* Controls Panel */}
      <div className="w-full lg:w-80 space-y-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Real Shoe Viewer</h2>

        {/* Color */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Color Tint</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-xs text-zinc-500 font-mono w-16">{color}</span>
          </div>
        </div>

        {/* Camera presets */}
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

        {/* Auto Rotate */}
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
        <div className="flex gap-2 pt-1">
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