import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, Sphere, Cylinder, Plane } from "@react-three/drei";
import * as THREE from "three";

const Robot: React.FC<{
  isWalking: boolean;
  isDancing: boolean;
  isHovering: boolean;
}> = ({ isWalking, isDancing, isHovering }) => {
  const robotRef = React.useRef<THREE.Group>(null);
  const [eyeScale, setEyeScale] = useState(1);
  const [armRotation, setArmRotation] = useState(0);
  const [hoverOffset, setHoverOffset] = useState(0);
  const [bodyColor, setBodyColor] = useState("yellow");
  const [legRotation, setLegRotation] = useState(0);


  useFrame(({ clock, mouse }) => {
    if (robotRef.current) {
      robotRef.current.rotation.y += 0.01;

      // Head follows mouse
      const headRotation = Math.atan2(mouse.x, mouse.y);
      robotRef.current.children[0].rotation.y = headRotation * 0.5;

      if (isDancing) {
        robotRef.current.rotation.z =
          Math.sin(clock.getElapsedTime() * 10) * 0.1;
        setArmRotation(Math.sin(clock.getElapsedTime() * 10) * 0.5);
      } else {
        setArmRotation(Math.sin(clock.getElapsedTime()) * 0.2);
      }
    }
    const blinkInterval = Math.sin(clock.getElapsedTime() * 2) + 1;
    setEyeScale(blinkInterval < 0.1 ? 0.1 : 1);
    setHoverOffset(
      Math.sin(clock.getElapsedTime() * 2) * 0.1 + (isHovering ? 1 : 0)
    );

    if (isWalking) {
      setLegRotation(Math.sin(clock.getElapsedTime() * 5) * 0.5);
    }
  });

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setBodyColor(`hsl(${Math.random() * 360}, 100%, 50%)`);
    }, 3000);

    return () => clearInterval(colorInterval);
  }, []);

  return (
    <group ref={robotRef} position={[0, hoverOffset, 0]}>
      {/* Head */}
      <Sphere args={[0.8, 32, 32]} position={[0, 3.5, 0]}>
        <meshStandardMaterial color="silver" metalness={0.7} roughness={0.3} />
      </Sphere>
      {/* Eyes */}
      <Sphere
        args={[0.2, 32, 32]}
        position={[-0.3, 3.7, 0.6]}
        scale={[1, eyeScale, 1]}
      >
        <meshStandardMaterial
          color="blue"
          emissive="blue"
          emissiveIntensity={0.5}
        />
      </Sphere>
      <Sphere
        args={[0.2, 32, 32]}
        position={[0.3, 3.7, 0.6]}
        scale={[1, eyeScale, 1]}
      >
        <meshStandardMaterial
          color="blue"
          emissive="blue"
          emissiveIntensity={0.5}
        />
      </Sphere>
      {/* Antennas */}
      <Cylinder
        args={[0.05, 0.05, 0.5]}
        position={[-0.3, 4.2, 0]}
        rotation={[0, 0, 0.2]}
      >
        <meshStandardMaterial color="red" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder
        args={[0.05, 0.05, 0.5]}
        position={[0.3, 4.2, 0]}
        rotation={[0, 0, -0.2]}
      >
        <meshStandardMaterial color="red" metalness={0.8} roughness={0.2} />
      </Cylinder>
      {/* Mouth */}
      <Box args={[0.5, 0.1, 0.1]} position={[0, 3.2, 0.7]}>
        <meshStandardMaterial color="black" />
      </Box>
      {/* Body */}
      <Box args={[2, 3, 1.5]} position={[0, 1, 0]}>
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.5}
          roughness={0.5}
        />
      </Box>
      <Box args={[1, 1, 1.6]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="purple" metalness={0.7} roughness={0.3} />
      </Box>
      {/* Chest Emblem */}
      <Box args={[0.8, 0.8, 0.1]} position={[0, 1.5, 0.8]}>
        <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Arms */}
      <Cylinder
        args={[0.3, 0.3, 2]}
        position={[-1.3, 1.5, 0]}
        rotation={[0, 0, Math.PI / 2 + armRotation]}
      >
        <meshStandardMaterial
          color="darkgray"
          metalness={0.6}
          roughness={0.4}
        />
      </Cylinder>
      <Cylinder
        args={[0.3, 0.3, 2]}
        position={[1.3, 1.5, 0]}
        rotation={[0, 0, Math.PI / 2 - armRotation]}
      >
        <meshStandardMaterial
          color="darkgray"
          metalness={0.6}
          roughness={0.4}
        />
      </Cylinder>
      {/* Hands */}
      <Sphere args={[0.3, 32, 32]} position={[-2.3, 1.5, 0]}>
        <meshStandardMaterial color="green" metalness={0.6} roughness={0.4} />
      </Sphere>
      <Sphere args={[0.3, 32, 32]} position={[2.3, 1.5, 0]}>
        <meshStandardMaterial color="green" metalness={0.6} roughness={0.4} />
      </Sphere>
      {/* Legs */}
      <Cylinder
        args={[0.4, 0.4, 2.5]}
        position={[-0.6, -1.5, 0]}
        rotation={[legRotation, 0, 0]}
      >
        <meshStandardMaterial
          color="darkgray"
          metalness={0.6}
          roughness={0.4}
        />
      </Cylinder>
      <Cylinder
        args={[0.4, 0.4, 2.5]}
        position={[0.6, -1.5, 0]}
        rotation={[-legRotation, 0, 0]}
      >
        <meshStandardMaterial
          color="darkgray"
          metalness={0.6}
          roughness={0.4}
        />
      </Cylinder>
      {/* Feet */}
      <Box args={[0.6, 0.2, 0.8]} position={[-0.6, -2.9, 0.2]}>
        <meshStandardMaterial color="orange" metalness={0.5} roughness={0.5} />
      </Box>
      <Box args={[0.6, 0.2, 0.8]} position={[0.6, -2.9, 0.2]}>
        <meshStandardMaterial color="orange" metalness={0.5} roughness={0.5} />
      </Box>
      <JetpackEffect isHovering={isHovering} />
    </group>
  );
};

const JetpackEffect: React.FC<{ isHovering: boolean }> = ({ isHovering }) => {
  return isHovering ? (
    <group position={[0, -1.5, -0.5]}>
      <Cylinder args={[0.1, 0.3, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="orange"
          emissive="orange"
          emissiveIntensity={0.5}
        />
      </Cylinder>
    </group>
  ) : null;
};

const Particles = () => {
  const particlesRef = React.useRef<THREE.Points>(null);
  const particleCount = 1000;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.position.y =
        Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="white" />
    </points>
  );
};

const Ground: React.FC = () => (
  <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
    <meshStandardMaterial color="#444" />
  </Plane>
);

const DayNightCycle: React.FC = () => {
  const lightRef = React.useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const time = clock.getElapsedTime() * 0.1;
      lightRef.current.position.x = Math.cos(time) * 10;
      lightRef.current.position.y = Math.sin(time) * 10;
      lightRef.current.intensity = Math.max(Math.sin(time), 0.1);
    }
  });

  return (
    <directionalLight ref={lightRef} color="white" position={[0, 10, 0]} />
  );
};

const ControlPanel: React.FC<{
  toggleWalk: () => void;
  dance: () => void;
  toggleHover: () => void;
}> = ({ toggleWalk, dance, toggleHover }) => {
  return (
    <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
      <button onClick={toggleWalk}>Walk</button>
      <button onClick={dance}>Dance</button>
      <button onClick={toggleHover}>Hover</button>
    </div>
  );
};

const RobotMan: React.FC = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDancing, setIsDancing] = useState(false);

  const toggleWalk = () => setIsWalking(!isWalking);
  const toggleHover = () => setIsHovering(!isHovering);
  const dance = () => {
    setIsDancing(true);
    setTimeout(() => setIsDancing(false), 5000);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setIsWalking(true);
          break;
        case "s":
          setIsWalking(false);
          break;
        case "d":
          dance();
          break;
        case "h":
          toggleHover();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isHovering]);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <DayNightCycle />
        <Robot isWalking={isWalking} isDancing={isDancing} isHovering={isHovering} />
        <Particles />
        <Ground />
      </Canvas>
      <ControlPanel
        toggleWalk={toggleWalk}
        dance={dance}
        toggleHover={toggleHover}
      />
    </>
  );
};

export default RobotMan;
