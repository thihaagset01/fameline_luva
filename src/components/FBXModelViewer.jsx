import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";

function FBXModel({ url, pivot = [0, 0, 0] }) {
  const fbx = useFBX(url);
  // Invert the pivot offset to move the model so the desired pivot is at the origin
  return (
    <group position={[-pivot[0], -pivot[1], -pivot[2]]}>
      <primitive object={fbx} scale={0.01} />
    </group>
  );
}

const FBXModelViewer = ({ url }) => (
  <div style={{ width: "100%", height: "900px" }}>
    <Canvas camera={{ position: [1, 1, 1], fov: 50 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 50, 0]} />
      <Suspense fallback={null}>
        <FBXModel url={url} />
      </Suspense>
      <OrbitControls maxDistance={4} minDistance={2}/>
    </Canvas>
  </div>
);

export default FBXModelViewer;  
