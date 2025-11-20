import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDarkMode } from '../hooks/useDarkMode';

interface NetworkBackgroundProps {
  particleCount?: number;
  minDistance?: number;
  maxConnections?: number;
  limitConnections?: boolean;
}

const NetworkBackground: React.FC<NetworkBackgroundProps> = ({
  particleCount = 500,
  minDistance = 150,
  maxConnections = 20,
  limitConnections = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const pointCloudRef = useRef<THREE.Points | null>(null);
  const linesMeshRef = useRef<THREE.LineSegments | null>(null);
  const particlesDataRef = useRef<Array<{ velocity: THREE.Vector3; numConnections: number }>>([]);
  const particlePositionsRef = useRef<Float32Array | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const maxParticleCount = 1000;
    const r = 800;
    const rHalf = r / 2;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      4000
    );
    camera.position.z = 1750;
    cameraRef.current = camera;

    // Create group
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Helper box (optional, for visual reference)
    const helper = new THREE.BoxHelper(
      new THREE.Mesh(new THREE.BoxGeometry(r, r, r))
    );
    helper.material.color.setHex(isDarkMode ? 0x474747 : 0xcccccc);
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;
    group.add(helper);

    // Initialize arrays
    const segments = maxParticleCount * maxParticleCount;
    const positions = new Float32Array(segments * 3);
    const colors = new Float32Array(segments * 3);
    positionsRef.current = positions;
    colorsRef.current = colors;

    // Create particles material
    const pMaterial = new THREE.PointsMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      size: 3,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: false,
    });

    // Create particles geometry
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(maxParticleCount * 3);
    particlePositionsRef.current = particlePositions;

    const particlesData: Array<{ velocity: THREE.Vector3; numConnections: number }> = [];

    // Initialize particles
    for (let i = 0; i < maxParticleCount; i++) {
      const x = Math.random() * r - rHalf;
      const y = Math.random() * r - rHalf;
      const z = Math.random() * r - rHalf;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particlesData.push({
        velocity: new THREE.Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        ),
        numConnections: 0,
      });
    }

    particlesDataRef.current = particlesData;

    particles.setDrawRange(0, particleCount);
    particles.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );

    // Create point cloud
    const pointCloud = new THREE.Points(particles, pMaterial);
    group.add(pointCloud);
    pointCloudRef.current = pointCloud;

    // Create lines geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geometry.computeBoundingSphere();
    geometry.setDrawRange(0, 0);

    // Create lines material
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const linesMesh = new THREE.LineSegments(geometry, material);
    group.add(linesMesh);
    linesMeshRef.current = linesMesh;

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

    // Window resize handler
    const onWindowResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (
        !cameraRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !groupRef.current ||
        !pointCloudRef.current ||
        !linesMeshRef.current ||
        !particlePositionsRef.current ||
        !positionsRef.current ||
        !colorsRef.current
      )
        return;

      const particlePositions = particlePositionsRef.current;
      const positions = positionsRef.current;
      const colors = colorsRef.current;
      const particlesData = particlesDataRef.current;

      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;

      // Reset connection counts
      for (let i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0;
      }

      // Update particle positions and check connections
      for (let i = 0; i < particleCount; i++) {
        const particleData = particlesData[i];

        particlePositions[i * 3] += particleData.velocity.x;
        particlePositions[i * 3 + 1] += particleData.velocity.y;
        particlePositions[i * 3 + 2] += particleData.velocity.z;

        // Bounce off walls
        if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf)
          particleData.velocity.y = -particleData.velocity.y;

        if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
          particleData.velocity.x = -particleData.velocity.x;

        if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf)
          particleData.velocity.z = -particleData.velocity.z;

        if (limitConnections && particleData.numConnections >= maxConnections)
          continue;

        // Check connections with other particles
        for (let j = i + 1; j < particleCount; j++) {
          const particleDataB = particlesData[j];
          if (limitConnections && particleDataB.numConnections >= maxConnections)
            continue;

          const dx = particlePositions[i * 3] - particlePositions[j * 3];
          const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
          const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < minDistance) {
            particleData.numConnections++;
            particleDataB.numConnections++;

            const alpha = 1.0 - dist / minDistance;

            positions[vertexpos++] = particlePositions[i * 3];
            positions[vertexpos++] = particlePositions[i * 3 + 1];
            positions[vertexpos++] = particlePositions[i * 3 + 2];

            positions[vertexpos++] = particlePositions[j * 3];
            positions[vertexpos++] = particlePositions[j * 3 + 1];
            positions[vertexpos++] = particlePositions[j * 3 + 2];

            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;

            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;

            numConnected++;
          }
        }
      }

      // Update geometry
      linesMeshRef.current.geometry.setDrawRange(0, numConnected * 2);
      linesMeshRef.current.geometry.attributes.position.needsUpdate = true;
      linesMeshRef.current.geometry.attributes.color.needsUpdate = true;
      pointCloudRef.current.geometry.attributes.position.needsUpdate = true;

      // Rotate group
      const time = Date.now() * 0.001;
      groupRef.current.rotation.y = time * 0.1;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Start animation
    animate();

    // Add event listeners
    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener('resize', onWindowResize);

      if (mount && rendererRef.current) {
        try {
          mount.removeChild(rendererRef.current.domElement);
        } catch {
          // Element might already be removed
        }
      }

      // Dispose of Three.js resources
      if (pointCloudRef.current) {
        pointCloudRef.current.geometry.dispose();
        if (pointCloudRef.current.material instanceof THREE.Material) {
          pointCloudRef.current.material.dispose();
        }
      }
      if (linesMeshRef.current) {
        linesMeshRef.current.geometry.dispose();
        if (linesMeshRef.current.material instanceof THREE.Material) {
          linesMeshRef.current.material.dispose();
        }
      }
      rendererRef.current?.dispose();
    };
  }, [particleCount, minDistance, maxConnections, limitConnections, isDarkMode]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default NetworkBackground;

