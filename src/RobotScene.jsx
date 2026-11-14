import { Component, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Html, useGLTF } from "@react-three/drei";

// Updated path to point directly to public folder root where your file lives
const ROBOT_MODEL_PATH = "/cartoon-robot.glb";

// Error handling without replacing your robot
class RobotErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error) {
    console.error("ORBI model loading error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="robot-error">
          Unable to load ORBI.
          <p>Please check cartoon-robot.glb</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Load your original GLB model
function RobotModel() {
  const { scene } = useGLTF(ROBOT_MODEL_PATH);

  return (
    <Center>
      <primitive
        object={scene}
        scale={1.5}
      />
    </Center>
  );
}

// Loading message
function RobotLoading() {
  return (
    <Html center>
      <div className="robot-loading">
        Loading ORBI...
      </div>
    </Html>
  );
}

function RobotScene() {
  return (
    <RobotErrorBoundary>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 40,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[3, 5, 5]}
          intensity={2}
        />

        <directionalLight
          position={[-3, 2, -2]}
          intensity={1}
        />

        <pointLight
          position={[0, 2, 3]}
          intensity={1}
          color="#65c8ff"
        />

        {/* Original robot */}
        <Suspense fallback={<RobotLoading />}>
          <RobotModel />
        </Suspense>
      </Canvas>
    </RobotErrorBoundary>
  );
}

export default RobotScene;