import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Landmarks.module.css';

gsap.registerPlugin(ScrollTrigger);

const Landmarks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current || !landmarksRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const createLandmark = (x: number, y: number, z: number) => {
      const geometry = new THREE.ConeGeometry(1, 2, 32);
      const material = new THREE.MeshPhongMaterial({ color: 0xffd700 });
      const landmark = new THREE.Mesh(geometry, material);
      landmark.position.set(x, y, z);
      return landmark;
    };

    const landmarks = [
      createLandmark(-5, 0, -5),
      createLandmark(0, 0, 0),
      createLandmark(5, 0, -5),
    ];

    landmarks.forEach(landmark => scene.add(landmark));

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      landmarks.forEach(landmark => landmark.rotation.y += 0.01);
      renderer.render(scene, camera);
    };

    animate();

    gsap.from(landmarks, {
      y: -10,
      duration: 2,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.from(landmarksRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      landmarks.forEach(landmark => scene.remove(landmark));
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.landmarks}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={landmarksRef} className={styles.content}>
        <h2>Iconic Landmarks</h2>
        <ul>
          <li>Burj Khalifa - The world's tallest building</li>
          <li>Sheikh Zayed Mosque - A masterpiece of modern Islamic architecture</li>
          <li>Palm Jumeirah - The artificial archipelago</li>
        </ul>
      </div>
    </section>
  );
};

export default Landmarks;
