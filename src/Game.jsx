import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  useGLTF
} from "@react-three/drei";

import {
  Rocket,
  House,
  Sprout,
  Zap,
  Droplets,
  Wind,
  RotateCw,
  Trash2,
  ArrowLeft,
  Settings,
  CircleHelp,
  Cpu,
  Globe,
  Plus,
  Minus
} from "lucide-react";

import "./Game.css";

// ================================
// BUILDING MODELS (All except the last base file, with random prices and download hours)
// ================================

const models = [
  {
    id: "greenhouse",
    name: "Greenhouse",
    icon: Sprout,
    color: "#4ade80",
    path: "/models/greenhouse.glb",
    defaultScale: 0.3,
    price: 150,
    downloadHours: 3
  },
  {
    id: "oxygen_tank",
    name: "Oxygen Tank",
    icon: Droplets,
    color: "#38bdf8",
    path: "/models/oxygen_tank.glb",
    defaultScale: 0.25,
    price: 80,
    downloadHours: 2
  },
  {
    id: "rocks_stones",
    name: "Rocks & Stones",
    icon: Globe,
    color: "#a1aab8",
    path: "/models/rocks_and_stones_pack.glb",
    defaultScale: 0.2,
    price: 45,
    downloadHours: 1
  },
  {
    id: "small_habitat",
    name: "Small Habitat",
    icon: House,
    color: "#38bdf8",
    path: "/models/small_low_poly_habitat.glb",
    defaultScale: 0.3,
    price: 300,
    downloadHours: 5
  },
  {
    id: "solar_panel",
    name: "Solar Panel",
    icon: Zap,
    color: "#facc15",
    path: "/models/solar_panel.glb",
    defaultScale: 0.25,
    price: 120,
    downloadHours: 2
  },
  {
    id: "energy_cell",
    name: "Energy Cell",
    icon: Cpu,
    color: "#facc15",
    path: "/models/stylized_energy_cell.glb",
    defaultScale: 0.2,
    price: 95,
    downloadHours: 3
  },
  {
    id: "mangrove_greenhouse",
    name: "Mangrove Greenhouse",
    icon: Sprout,
    color: "#22c55e",
    path: "/models/stylized_mangrove_greenhouse (1).glb",
    defaultScale: 0.3,
    price: 220,
    downloadHours: 4
  },
  {
    id: "water_tank",
    name: "Water Tank Tower",
    icon: Droplets,
    color: "#0284c7",
    path: "/models/water_tank_tower_with_stairs.glb",
    defaultScale: 0.25,
    price: 175,
    downloadHours: 3
  },
  {
    id: "wind_turbine",
    name: "Wind Turbine",
    icon: Wind,
    color: "#22d3ee",
    path: "/models/wind_turbine.glb",
    defaultScale: 0.25,
    price: 135,
    downloadHours: 3
  }
];

// ================================
// EXTERNAL GLTF MODEL COMPONENT
// ================================

function GLTFModel({ path, scale = 1, position, rotation = 0, preview = false }) {
  const { scene } = useGLTF(path);
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  const finalScale = preview ? scale * 0.95 : scale;

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={[0, rotation, 0]}
      scale={finalScale}
    />
  );
}

// ================================
// MOON TERRAIN (Using the last file as the Base)[cite: 2]
// ================================

function MoonTerrain() {
  const { scene } = useGLTF("/models/moon_terrain.glb");

  return (
    <primitive
      object={scene}
      position={[0, -0.8, 0]}
      scale={[3.5, 0.1, 3.5]} // قاعدة مسطحة وواسعة
    />
  );
}

// ================================
// BUILDING COMPONENT
// ================================

function Model({
  type,
  position,
  rotation = 0,
  scale = 1,
  preview = false
}) {
  const foundModel = models.find((m) => m.id === type);

  if (!foundModel) return null;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <GLTFModel 
        path={foundModel.path} 
        scale={scale} 
        position={[0, 0, 0]} 
        rotation={0} 
        preview={preview} 
      />
    </group>
  );
}

// ================================
// MOON SCENE
// ================================

function MoonScene({
  buildings,
  selected,
  previewPosition,
  rotation,
  currentScale,
  setPreviewPosition,
  startDownloading
}) {
  return (
    <>
      <ambientLight intensity={1.1} />

      <directionalLight
        position={[8, 12, 5]}
        intensity={2}
        castShadow
      />

      <Stars
        radius={100}
        depth={50}
        count={1800}
        factor={4}
        fade
      />

      <MoonTerrain />

      <gridHelper
        args={[35, 35, "#475569", "#334155"]}
        position={[0, -0.01, 0]}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerMove={(e) => {
          if (selected) {
            e.stopPropagation();
            setPreviewPosition([
              e.point.x,
              0,
              e.point.z
            ]);
          }
        }}
        onClick={(e) => {
          if (selected) {
            e.stopPropagation();
            startDownloading([
              e.point.x,
              0,
              e.point.z
            ]);
          }
        }}
      >
        <planeGeometry args={[50, 50]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          colorWrite={false}
          depthWrite={false}
          side={2}
        />
      </mesh>

      {buildings.map((building) => (
        <Model
          key={building.id}
          type={building.type}
          position={building.position}
          rotation={building.rotation}
          scale={building.scale}
        />
      ))}

      {selected && (
        <Model
          key={selected}
          type={selected}
          position={previewPosition}
          rotation={rotation}
          scale={currentScale}
          preview
        />
      )}

      <OrbitControls
        target={[0, 0, 0]}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// ================================
// MAIN GAME
// ================================

export default function Game({ goHome }) {
  const [selected, setSelected] = useState(null);
  const [previewPosition, setPreviewPosition] = useState([0, 0, 0]);
  const [buildings, setBuildings] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [currentScale, setCurrentScale] = useState(0.3);

  const [isDownloadingPlacement, setIsDownloadingPlacement] = useState(false);
  const [pendingPosition, setPendingPosition] = useState(null);
  const [downloadTimeLeft, setDownloadTimeLeft] = useState(0);
  const [totalDownloadHours, setTotalDownloadHours] = useState(0);

  // Timer effect for downloading hours simulation
  useEffect(() => {
    let timer;
    if (isDownloadingPlacement && downloadTimeLeft > 0) {
      timer = setInterval(() => {
        setDownloadTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (pendingPosition && selected) {
              setBuildings((b) => [
                ...b,
                {
                  id: Date.now() + Math.random(),
                  type: selected,
                  position: pendingPosition,
                  rotation,
                  scale: currentScale
                }
              ]);
            }
            setIsDownloadingPlacement(false);
            setSelected(null);
            setPendingPosition(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDownloadingPlacement, downloadTimeLeft, pendingPosition, selected, rotation, currentScale]);

  const startDownloadingPlacement = (position) => {
    if (isDownloadingPlacement) return;
    const model = models.find((m) => m.id === selected);
    if (!model) return;

    setPendingPosition(position);
    setTotalDownloadHours(model.downloadHours);
    setDownloadTimeLeft(model.downloadHours);
    setIsDownloadingPlacement(true);
  };

  const undoBuilding = () => {
    if (!buildings.length) return;
    setBuildings((prev) => prev.slice(0, -1));
  };

  const handleSelectModel = (model) => {
    if (isDownloadingPlacement) return;
    setSelected(model.id);
    setCurrentScale(model.defaultScale);
    setPreviewPosition([0, 0, 0]);
  };

  // Helper to Arabic hour wording
  const getHourText = (hours) => {
    if (hours === 1) return "الساعة الأولى";
    if (hours === 2) return "الساعة الثانية";
    if (hours === 3) return "الساعة الثالثة";
    if (hours === 4) return "الساعة الرابعة";
    if (hours === 5) return "الساعة الخامسة";
    if (hours === 6) return "الساعة السادسة";
    return `الساعة ${hours}`;
  };

  return (
    <div className="orbit-game">
      {/* HEADER */}
      <header className="game-header">
        <div className="game-logo">
          <Rocket size={24} />
          <span>
            Orbit<span>ED</span>
          </span>
        </div>

        <div className="game-day">
          DAY 01
        </div>

        <div className="game-actions" style={{ marginLeft: "auto" }}>
          <button
            onClick={goHome}
            title="Back to Home"
            className="back-home"
          >
            <ArrowLeft size={18} />
            Home
          </button>

          <button title="Settings">
            <Settings />
          </button>

          <button title="Help">
            <CircleHelp />
          </button>
        </div>
      </header>

      {/* GAME WORLD */}
      <main className="game-world">
        <Canvas
          shadows
          camera={{
            position: [12, 13, 16],
            fov: 45
          }}
        >
          <Suspense fallback={null}>
            <MoonScene
              buildings={buildings}
              selected={selected && !isDownloadingPlacement ? selected : null}
              previewPosition={previewPosition}
              rotation={rotation}
              currentScale={currentScale}
              setPreviewPosition={setPreviewPosition}
              startDownloading={startDownloadingPlacement}
            />
          </Suspense>
        </Canvas>

        {/* MISSION OBJECTIVE */}
        <div className="game-mission">
          <h3>⭐ Mission Objective</h3>
          <p>
            Build your base on the flattened Moon terrain.
          </p>

          <div className="game-progress">
            <div
              style={{
                width: `${Math.min(buildings.length * 10, 100)}%`
              }}
            />
          </div>

          <small>
            {buildings.length} Structures Placed
          </small>
        </div>

        {/* BUILD MENU */}
        <aside className="game-build-menu">
          <h3>BUILD MENU</h3>
          <p>Select component</p>

          <div className="models-list-container">
            {models.map((model) => {
              const Icon = model.icon;

              return (
                <button
                  key={model.id}
                  disabled={isDownloadingPlacement}
                  className={`game-model ${
                    selected === model.id ? "chosen" : ""
                  }`}
                  onClick={() => handleSelectModel(model)}
                >
                  <div className="model-icon-circle">
                    <Icon
                      color={model.color}
                      size={20}
                    />
                  </div>

                  <span>
                    <b>{model.name}</b>
                    <small style={{ color: "#facc15" }}>
                      Price: ${model.price} · {model.downloadHours}h
                    </small>
                  </span>

                  <span className="model-plus">
                    +
                  </span>
                </button>
              );
            })}
          </div>

          {/* PLACEMENT & FLEXIBLE SIZE CONTROLS */}
          {selected && !isDownloadingPlacement && (
            <div className="game-placement">
              <p>Placement & Size Controls</p>

              <div style={{ display: "flex", gap: "5px", marginBottom: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setRotation((r) => r + Math.PI / 4)}
                >
                  <RotateCw size={14} />
                  Rotate
                </button>

                <button
                  onClick={() => setCurrentScale((s) => Math.max(0.1, s - 0.05))}
                  title="Shrink Size"
                >
                  <Minus size={14} />
                  تصغير
                </button>

                <button
                  onClick={() => setCurrentScale((s) => Math.min(1.5, s + 0.05))}
                  title="Enlarge Size"
                >
                  <Plus size={14} />
                  تكبير
                </button>
              </div>

              <button
                onClick={() => {
                  setSelected(null);
                  setRotation(0);
                }}
                style={{ width: "100%" }}
              >
                Cancel
              </button>
            </div>
          )}
        </aside>

        {/* INSTRUCTIONS OR DOWNLOADING STATUS WITH HOURS */}
        {selected && !isDownloadingPlacement && (
          <div className="game-instruction">
            Click on the Moon base to deploy component (Use buttons to adjust size!)
          </div>
        )}

        {isDownloadingPlacement && (
          <div className="game-instruction" style={{ background: "rgba(234, 179, 8, 0.95)", color: "#000", fontWeight: "bold" }}>
            ⏳ جاري التحميل والتنزيل... {getHourText(downloadTimeLeft)} (متبقي {downloadTimeLeft} ساعات)
          </div>
        )}

        {/* BOTTOM BAR */}
        <div className="game-bottom">
          <div>
            <House size={17} />
            {buildings.length} Structures
          </div>

          <button
            onClick={undoBuilding}
            disabled={!buildings.length || isDownloadingPlacement}
          >
            <Trash2 size={16} />
            Undo Last
          </button>
        </div>

        {/* CAMERA HELP */}
        <div className="game-camera-help">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </main>
    </div>
  );
}

// Preload Models including the new terrain base
models.forEach((m) => useGLTF.preload(m.path));
useGLTF.preload("/models/moon_terrain.glb");