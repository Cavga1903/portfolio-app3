import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDarkMode } from '../hooks/useDarkMode';

interface SnowflakeBackgroundProps {
  particleCount?: number;
  speed?: number;
}

const SnowflakeBackground: React.FC<SnowflakeBackgroundProps> = ({
  particleCount = 10000,
  speed = 0.00005,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);
  const materialsRef = useRef<THREE.PointsMaterial[]>([]);
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
      0.0008
    );
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 1000;
    cameraRef.current = camera;

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];

    // Generate random particle positions
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;
      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    // Create snowflake textures programmatically
    const createSnowflakeTexture = (size: number, complexity: number): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.clearRect(0, 0, size, size);
        context.translate(size / 2, size / 2);
        
        // Draw snowflake pattern
        const branches = 6;
        const branchLength = size * 0.4;
        
        for (let i = 0; i < branches; i++) {
          context.save();
          context.rotate((Math.PI * 2 * i) / branches);
          
          // Main branch
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(0, -branchLength);
          context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          context.lineWidth = 2;
          context.stroke();
          
          // Side branches
          for (let j = 1; j <= complexity; j++) {
            const pos = (branchLength * j) / (complexity + 1);
            context.beginPath();
            context.moveTo(0, -pos);
            context.lineTo(-branchLength * 0.2, -pos - branchLength * 0.1);
            context.moveTo(0, -pos);
            context.lineTo(branchLength * 0.2, -pos - branchLength * 0.1);
            context.stroke();
          }
          
          context.restore();
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Create multiple snowflake types with different sizes and complexities
    const sprite1 = createSnowflakeTexture(64, 2);
    const sprite2 = createSnowflakeTexture(128, 3);
    const sprite3 = createSnowflakeTexture(96, 2);
    const sprite4 = createSnowflakeTexture(80, 1);
    const sprite5 = createSnowflakeTexture(112, 2);

    // Parameters: [HSL color, sprite, size]
    const parameters: Array<[number[], THREE.Texture, number]> = [
      [[1.0, 0.2, 0.5], sprite2, 20],
      [[0.95, 0.1, 0.5], sprite3, 15],
      [[0.90, 0.05, 0.5], sprite1, 10],
      [[0.85, 0, 0.5], sprite5, 8],
      [[0.80, 0, 0.5], sprite4, 5],
    ];

    const materials: THREE.PointsMaterial[] = [];
    const particles: THREE.Points[] = [];

    // Create multiple particle systems with different materials
    for (let i = 0; i < parameters.length; i++) {
      const color = parameters[i][0];
      const sprite = parameters[i][1];
      const size = parameters[i][2];

      const material = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });

      material.color.setHSL(color[0], color[1], color[2], THREE.SRGBColorSpace);
      materials.push(material);
      materialsRef.current = materials;

      const particleSystem = new THREE.Points(geometry, material);
      particleSystem.rotation.x = Math.random() * 6;
      particleSystem.rotation.y = Math.random() * 6;
      particleSystem.rotation.z = Math.random() * 6;

      scene.add(particleSystem);
      particles.push(particleSystem);
      particlesRef.current = particles;
    }

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

      if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

      const time = Date.now() * speed;

      // Smooth camera movement based on mouse
      cameraRef.current.position.x +=
        (mouseXRef.current - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y +=
        (-mouseYRef.current - cameraRef.current.position.y) * 0.05;

      cameraRef.current.lookAt(scene.position);

      // Rotate particle systems
      for (let i = 0; i < particlesRef.current.length; i++) {
        const object = particlesRef.current[i];
        if (object instanceof THREE.Points) {
          object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
      }

      // Animate colors
      for (let i = 0; i < materialsRef.current.length; i++) {
        const color = parameters[i][0];
        const h = ((360 * (color[0] + time)) % 360) / 360;
        materialsRef.current[i].color.setHSL(
          h,
          color[1],
          color[2],
          THREE.SRGBColorSpace
        );
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

      if (mount && rendererRef.current) {
        try {
          mount.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Element might already be removed
        }
      }

      // Dispose of Three.js resources
      geometry.dispose();
      materialsRef.current.forEach((material) => {
        material.dispose();
        if (material.map) material.map.dispose();
      });
      particlesRef.current.forEach((particles) => {
        particles.geometry.dispose();
      });
      rendererRef.current?.dispose();
    };
  }, [particleCount, speed, isDarkMode]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default SnowflakeBackground;

