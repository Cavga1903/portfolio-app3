import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDarkMode } from '../hooks/useDarkMode';

interface ParticleBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  speed?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 10000,
  particleSize = 35,
  speed = 0.00005,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const windowHalfXRef = useRef(window.innerWidth / 2);
  const windowHalfYRef = useRef(window.innerHeight / 2);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(
      isDarkMode ? 0x000000 : 0xffffff,
      0.001
    );
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      2,
      2000
    );
    camera.position.z = 1000;
    cameraRef.current = camera;

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];

    // Create particle sprite texture programmatically
    const createParticleTexture = (): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Create a radial gradient for the particle
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const sprite = createParticleTexture();

    // Generate random particle positions
    for (let i = 0; i < particleCount; i++) {
      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;
      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    // Create material
    const material = new THREE.PointsMaterial({
      size: particleSize,
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.5,
      transparent: true,
      depthWrite: false,
    });

    // Set initial color based on theme
    if (isDarkMode) {
      material.color.setHSL(0.6, 0.3, 0.7, THREE.SRGBColorSpace);
    } else {
      material.color.setHSL(0.5, 0.5, 0.5, THREE.SRGBColorSpace);
    }

    materialRef.current = material;

    // Create particles
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Mouse move handler
    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;

      mouseXRef.current = event.clientX - windowHalfXRef.current;
      mouseYRef.current = event.clientY - windowHalfYRef.current;
    };

    // Window resize handler
    const onWindowResize = () => {
      windowHalfXRef.current = window.innerWidth / 2;
      windowHalfYRef.current = window.innerHeight / 2;

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!cameraRef.current || !rendererRef.current || !materialRef.current || !sceneRef.current) return;

      const time = Date.now() * speed;

      // Smooth camera movement based on mouse
      cameraRef.current.position.x +=
        (mouseXRef.current - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y +=
        (-mouseYRef.current - cameraRef.current.position.y) * 0.05;

      cameraRef.current.lookAt(scene.position);

      // Animate color based on time
      const h = ((360 * (1.0 + time)) % 360) / 360;
      if (isDarkMode) {
        materialRef.current.color.setHSL(h, 0.5, 0.5, THREE.SRGBColorSpace);
      } else {
        materialRef.current.color.setHSL(h, 0.3, 0.6, THREE.SRGBColorSpace);
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Start animation
    animate();

    // Add event listeners
    document.body.style.touchAction = 'none';
    document.body.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      document.body.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onWindowResize);

      // Use the mount reference captured at the start of the effect
      if (mount && rendererRef.current) {
        try {
          mount.removeChild(rendererRef.current.domElement);
        } catch {
          // Element might already be removed
        }
      }

      // Dispose of Three.js resources
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      rendererRef.current?.dispose();
    };
  }, [particleCount, particleSize, speed, isDarkMode]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticleBackground;

