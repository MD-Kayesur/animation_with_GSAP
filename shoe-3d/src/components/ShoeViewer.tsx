"use client";

import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function ShoeViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // UI State
  const [tshirtColor, setTshirtColor] = React.useState("#ffffff");
  const [pantColor, setPantColor] = React.useState("#ffffff");
  const [bodyColor, setBodyColor] = React.useState("#ffffff");
  const [animations, setAnimations] = React.useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = React.useState<string>("");
  const [animationSpeed, setAnimationSpeed] = React.useState(0.5);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showPanel, setShowPanel] = React.useState(false);

  // Three.js refs
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const modelRef = React.useRef<THREE.Group | null>(null);
  const mixerRef = React.useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = React.useRef<Record<string, THREE.AnimationAction>>({});
  const clockRef = React.useRef(new THREE.Clock());
  const materialsRef = React.useRef<{ name: string; mat: THREE.MeshStandardMaterial }[]>([]);
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
      "/textures/Meshy_AI_Meshy_Merged_Animations.glb?v=" + Date.now(), // ← your file path with cache buster
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
        const materials: { name: string; mat: THREE.MeshStandardMaterial }[] = [];
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
              materials.push({
                name: child.name.toLowerCase(),
                mat: child.material as THREE.MeshStandardMaterial
              });
            }
          }
        });

        materialsRef.current = materials;
        scene.add(model);

        // Setup Animations
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixer.timeScale = 0.5;
          mixerRef.current = mixer;
          const animNames: string[] = [];

          gltf.animations.forEach((clip) => {
            animNames.push(clip.name);
            actionsRef.current[clip.name] = mixer.clipAction(clip);
          });
          setAnimations(animNames);

          // Find a "run" animation, otherwise play the first one
          const defaultAnim = animNames.find((n) => n.toLowerCase().includes("run")) || animNames[0];
          if (defaultAnim) {
            setCurrentAnimation(defaultAnim);
            actionsRef.current[defaultAnim].play();
          }
        }

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

      const delta = clockRef.current.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

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
    materialsRef.current.forEach(({ name, mat }) => {
      const lowerName = name.toLowerCase();
      const matName = mat.name ? mat.name.toLowerCase() : "";
      
      if (lowerName.includes("pant") || lowerName.includes("bottom") || lowerName.includes("leg") || matName.includes("pant")) {
        mat.color.set(pantColor);
      } else if (lowerName.includes("shirt") || lowerName.includes("top") || lowerName.includes("torso") || matName.includes("shirt")) {
        mat.color.set(tshirtColor);
      } else {
        mat.color.set(bodyColor);
      }
      mat.needsUpdate = true;
    });
  }, [tshirtColor, pantColor, bodyColor]);

  // Animation speed control
  React.useEffect(() => {
    if (mixerRef.current) {
      mixerRef.current.timeScale = animationSpeed;
    }
  }, [animationSpeed]);

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
    setTshirtColor("#ffffff");
    setPantColor("#ffffff");
    setBodyColor("#ffffff");
    setAutoRotate(true);
    setCameraView("side");
    if (modelRef.current) modelRef.current.rotation.y = 0;
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 flex items-center justify-center overflow-hidden">
      {/* Background 3D Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
      />

      {/* Overlay Text around the model */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-16 z-[9999]">
        <div className="flex justify-between items-start">
          <div className="pointer-events-auto">
            <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg selection:bg-blue-500/30 leading-tight">
              MD Kayesur
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-blue-400 mt-2 uppercase tracking-wide">
              Full Stack Developer
            </h2>
            <p className="mt-4 text-zinc-300 max-w-sm text-lg font-medium drop-shadow-md selection:bg-blue-500/30">
              Now I am learning 3D animation.
            </p>
          </div>
          <div className="text-right drop-shadow-md pointer-events-auto selection:bg-blue-500/30">
            <p className="text-2xl font-bold text-white uppercase tracking-wider">Configurator</p>
            <p className="text-zinc-400 text-sm mt-1">Premium Quality</p>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="max-w-md drop-shadow-md pointer-events-auto selection:bg-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-2">Fully Interactive</h2>
            <p className="text-zinc-300 text-sm">
              Use the control panel on the right to change colors, animations, and camera angles on the fly.
            </p>
          </div>
          <div className="text-zinc-400 font-mono text-xs uppercase tracking-widest text-right drop-shadow-md hidden md:block lg:mr-80 pr-10 pointer-events-auto selection:bg-blue-500/30">
            Scroll to zoom<br/>Right-click to pan
          </div>
        </div>
      </div>

      {/* Loading / Error overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-20 backdrop-blur-sm">
          <p className="text-white text-xl animate-pulse tracking-widest uppercase">Initializing Engine...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 z-20">
          <p className="text-red-400 text-center px-4">{error}</p>
        </div>
      )}

      {/* Floating Auto-Rotate Toggle (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => setAutoRotate((v) => !v)}
          className={`flex items-center gap-2 px-6 py-3 backdrop-blur-md border rounded-full shadow-lg transition text-sm font-bold uppercase tracking-wider ${
            autoRotate 
              ? "bg-zinc-100/90 border-white text-zinc-900 hover:bg-white" 
              : "bg-zinc-900/80 border-zinc-700/50 text-white hover:bg-zinc-800"
          }`}
        >
          {autoRotate ? (
            <>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Stop Rotation
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
              Auto Rotate
            </>
          )}
        </button>
      </div>

      {/* Settings / Info Toggle Button */}
      <div className="absolute right-6 top-6 z-40">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="w-12 h-12 flex items-center justify-center bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-full shadow-lg hover:bg-zinc-800 transition text-white group"
          title="Toggle Customization"
        >
          {showPanel ? (
            <svg className="w-6 h-6 text-zinc-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span className="font-serif italic text-2xl text-zinc-300 group-hover:text-white">i</span>
          )}
        </button>
      </div>

      {/* Controls Panel (Floating) */}
      <div 
        className={`pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 w-80 space-y-5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-2xl z-30 max-h-[85vh] overflow-y-auto custom-scrollbar transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          showPanel ? "translate-x-0 opacity-100 visible" : "translate-x-[150%] opacity-0 invisible"
        }`}
      >
        <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Customization</h2>

        {/* Colors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">T-Shirt Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tshirtColor}
                onChange={(e) => setTshirtColor(e.target.value)}
                className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Pant Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={pantColor}
                onChange={(e) => setPantColor(e.target.value)}
                className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Body Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bodyColor}
                onChange={(e) => setBodyColor(e.target.value)}
                className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>
        </div>

        {/* Animations */}
        {animations.length > 0 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-400 mb-2">Animations</p>
              <div className="grid grid-cols-2 gap-2">
                {animations.map((animName) => (
                  <button
                    key={animName}
                    onClick={() => {
                      if (currentAnimation === animName) return;
                      const prevAction = actionsRef.current[currentAnimation];
                      const nextAction = actionsRef.current[animName];

                      if (prevAction) {
                        nextAction.reset().play();
                        prevAction.crossFadeTo(nextAction, 0.3, true);
                      } else {
                        nextAction.reset().play();
                      }
                      setCurrentAnimation(animName);
                    }}
                    className={`px-2 py-1.5 text-xs rounded-lg transition ${
                      currentAnimation === animName ? "bg-blue-600" : "bg-zinc-800 hover:bg-zinc-700"
                    }`}
                  >
                    {animName}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Speed</span>
                <span className="text-xs text-zinc-500 font-mono w-8 text-right">{animationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}