import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Stars, Html } from '@react-three/drei';
import SoccerBall from './SoccerBall';
import { FaFutbol, FaCalendarAlt, FaCreditCard, FaTrophy, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { FaUserAstronaut } from 'react-icons/fa'; // Import new icons
import { OrbitControls } from '@react-three/drei';

function OrbitIcon({ icon: Icon, radius, speed, angleOffset, color }) {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed;
    groupRef.current.position.x = Math.cos(time + angleOffset) * radius;
    groupRef.current.position.z = Math.sin(time + angleOffset) * radius;
  });

  return (
    <group ref={groupRef}>
      <Html center transform={false}>
        <div className={`p-3 rounded-full glass-premium text-${color}-400 text-xl shadow-[0_0_15px_currentColor]`}>
          <Icon />
        </div>
      </Html>
    </group>
  );
}

function OrbitSystem() {
  return (
    <group rotation={[0.4, 0, 0]}>
      {/* Orbit Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.45, 3.5, 64]} />
        <meshBasicMaterial color="#6D28D9" transparent opacity={0.2} side={2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.95, 5.0, 64]} />
        <meshBasicMaterial color="#9333EA" transparent opacity={0.15} side={2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.45, 6.5, 64]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.1} side={2} />
      </mesh>

      {/* Orbiting Icons (6 Icons as requested) */}
      <OrbitIcon icon={FaFutbol} radius={3.5} speed={0.4} angleOffset={0} color="brand" />
      <OrbitIcon icon={FaCalendarAlt} radius={3.5} speed={0.4} angleOffset={Math.PI} color="brand" />
      
      <OrbitIcon icon={FaCreditCard} radius={5} speed={-0.25} angleOffset={Math.PI/2} color="indigo" />
      <OrbitIcon icon={FaTrophy} radius={5} speed={-0.25} angleOffset={(Math.PI/2) * 3} color="purple" />

      <OrbitIcon icon={FaChartLine} radius={6.5} speed={0.15} angleOffset={Math.PI/4} color="blue" />
      <OrbitIcon icon={FaUserAstronaut} radius={6.5} speed={0.15} angleOffset={(Math.PI/4) * 5} color="cyan" />
    </group>
  );
}

function Scene({ mousePos }) {
  // We place the ball at x=5, y=0, z=0 which is further to the right side
  const BALL_POS = [5, 0, 0];
  
  return (
    <>
      <ambientLight intensity={0.5} color="#4c1d95" />
      <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={100} color="#C084FC" castShadow />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={100} color="#8b5cf6" castShadow />
      
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group position={BALL_POS}>
          <SoccerBall mousePos={mousePos} />
          <OrbitSystem />
        </group>
      </Float>
      
      <Environment preset="night" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={true} 
        autoRotateSpeed={0.5} 
        target={[1.5, 0, 0]} 
        makeDefault
      />
    </>
  );
}

export default function Hero3D() {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(20px)' },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    })
  };

  const titleText = "POLISOCCER";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background flex items-center">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-brand-600/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[150px] animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-none lg:pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Scene mousePos={mousePos} />
        </Canvas>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full lg:w-1/2 pt-20 lg:pt-0 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-brand-500/30 text-brand-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span className="text-sm font-medium tracking-wider">PREMIUM SPORTS TECHNOLOGY</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-6 flex overflow-hidden">
            {titleText.split('').map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                className={char === 'O' ? 'text-gradient' : ''}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.03,
                  delayChildren: 0.8
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-slate-400 max-w-xl font-light leading-relaxed mb-10"
          >
            {"Sistem pemesanan mini soccer yang praktis dan mudah digunakan. Rasakan kenyamanan pengelolaan dan jadwal yang tertata dengan baik.".split('').map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, filter: 'blur(2px)' },
                  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.2 } }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap gap-6"
          >
            <Link to="/register" className="group shimmer-button bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_40px_rgba(109,40,217,0.6)] transition-all duration-300 hover:scale-105">
              Get Started Now
            </Link>
            <Link to="/pricing" className="glass-premium hover:glass-glow-purple text-white px-8 py-4 rounded-full font-bold transition-all duration-300">
              View Pricing
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
