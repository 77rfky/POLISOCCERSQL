import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function SoccerBall({ mousePos }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    // Basic auto-rotation of the core
    meshRef.current.rotation.x += delta * (hovered ? 0.4 : 0.2);
    meshRef.current.rotation.y += delta * (hovered ? 0.6 : 0.3);

    // Interactive mouse rotation tracking (smooth interpolation)
    if (mousePos) {
      const targetRotationX = mousePos.current.y * (hovered ? 0.8 : 0.5);
      const targetRotationY = mousePos.current.x * (hovered ? 0.8 : 0.5);
      
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
    }

    // Scale animation for click pulse
    if (clicked) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      setTimeout(() => setClicked(false), 150);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <group 
      onPointerOver={() => setHover(true)} 
      onPointerOut={() => setHover(false)}
      onClick={() => setClicked(true)}
    >
      {/* Outer Glow Wireframe */}
      <Icosahedron args={[2.2, 2]} ref={meshRef}>
        <MeshDistortMaterial 
          color={hovered ? "#A855F7" : "#9333EA"} 
          wireframe 
          distort={hovered ? 0.4 : 0.2} 
          speed={hovered ? 4 : 2} 
          transparent 
          opacity={hovered ? 0.6 : 0.3} 
        />
      </Icosahedron>
      
      {/* Inner Solid Core */}
      <Icosahedron args={[2, 2]}>
        <meshStandardMaterial 
          color="#020617"
          roughness={0.1}
          metalness={0.9}
        />
      </Icosahedron>
      
      {/* Ambient Inner Light */}
      <pointLight 
        color={hovered ? "#D8B4FE" : "#C084FC"} 
        intensity={hovered ? 40 : 20} 
        distance={hovered ? 8 : 5} 
      />
    </group>
  );
}
