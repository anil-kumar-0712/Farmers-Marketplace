import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Dashboard3D = () => {
    const mountRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        const worldGroup = new THREE.Group();
        const interactiveGroup = new THREE.Group();
        scene.add(worldGroup);
        scene.add(interactiveGroup);

        // --- ENHANCED ASSET HELPERS ---
        const createLeaf = (color = 0x2d5a27, scale = 1) => {
            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0);
            leafShape.bezierCurveTo(0.4, 0.4, 0.4, 1.2, 0, 1.5);
            leafShape.bezierCurveTo(-0.4, 1.2, -0.4, 0.4, 0, 0);

            const geometry = new THREE.ExtrudeGeometry(leafShape, {
                depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02
            });
            const material = new THREE.MeshStandardMaterial({
                color,
                transparent: true,
                opacity: 0.4,
                roughness: 0.8,
                emissive: color,
                emissiveIntensity: 0.1
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(scale, scale, scale);
            return mesh;
        };

        const createFlower = (color = 0xffb7b7) => {
            const group = new THREE.Group();
            const center = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.3, transparent: true, opacity: 0.5 })
            );
            group.add(center);

            const petalGeom = new THREE.ConeGeometry(0.08, 0.3, 8);
            const petalMat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.4, emissive: color, emissiveIntensity: 0.2 });
            for (let i = 0; i < 5; i++) {
                const petal = new THREE.Mesh(petalGeom, petalMat);
                petal.position.x = Math.cos((i / 5) * Math.PI * 2) * 0.15;
                petal.position.y = Math.sin((i / 5) * Math.PI * 2) * 0.15;
                petal.rotation.z = (i / 5) * Math.PI * 2 - Math.PI / 2;
                group.add(petal);
            }
            return group;
        };

        // --- POPULATE SCENE ---
        // 1. Wheat Stalks (Background)
        for (let i = 0; i < 30; i++) {
            const stalk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.015, 0.015, 4, 6),
                new THREE.MeshStandardMaterial({ color: 0x8b9a46, transparent: true, opacity: 0.3 })
            );
            stalk.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, -15 - Math.random() * 10);
            stalk.rotation.z = (Math.random() - 0.5) * 0.5;
            worldGroup.add(stalk);
        }

        // 2. Lush Garden Leaves (Interactive Layer)
        for (let i = 0; i < 15; i++) {
            const leaf = createLeaf(Math.random() > 0.5 ? 0x1a3c1b : 0x274d28, 0.5 + Math.random() * 1.5);
            leaf.position.set((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 15, -5 - Math.random() * 5);
            leaf.rotation.set(Math.random(), Math.random(), Math.random());
            leaf.userData = { speed: 0.001 + Math.random() * 0.002, originalZ: leaf.position.z };
            interactiveGroup.add(leaf);
        }

        // 3. Floating Seed Particles
        const particles = [];
        const partGeom = new THREE.SphereGeometry(0.05, 8, 8);
        const partMat = new THREE.MeshStandardMaterial({ color: 0xfff9c4, emissive: 0xfff9c4, emissiveIntensity: 1, transparent: true, opacity: 0.8 });
        for (let i = 0; i < 40; i++) {
            const p = new THREE.Mesh(partGeom, partMat);
            p.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, Math.random() * 10 - 5);
            p.userData = {
                vx: (Math.random() - 0.5) * 0.01,
                vy: (Math.random() - 0.5) * 0.01,
                offset: Math.random() * Math.PI * 2
            };
            particles.push(p);
            scene.add(p);
        }

        // --- LIGHTING (Golden Hour) ---
        scene.add(new THREE.AmbientLight(0xfff3e0, 0.6));
        const sunLight = new THREE.DirectionalLight(0xffcc80, 1.2);
        sunLight.position.set(10, 10, 10);
        scene.add(sunLight);

        const fillLight = new THREE.PointLight(0x81c784, 0.8);
        fillLight.position.set(-10, -5, 5);
        scene.add(fillLight);

        camera.position.z = 10;

        // --- INTERACTION ---
        const onMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- ANIMATION ---
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = Date.now() * 0.001;

            // Parallax Effect
            interactiveGroup.position.x += (mouse.current.x * 2 - interactiveGroup.position.x) * 0.05;
            interactiveGroup.position.y += (mouse.current.y * 1.5 - interactiveGroup.position.y) * 0.05;

            worldGroup.position.x += (mouse.current.x * 0.5 - worldGroup.position.x) * 0.02;

            // Animate Particles
            particles.forEach(p => {
                p.position.x += p.userData.vx;
                p.position.y += Math.sin(time + p.userData.offset) * 0.005;
                if (Math.abs(p.position.x) > 20) p.position.x *= -1;
            });

            // Animate Leaves
            interactiveGroup.children.forEach((leaf) => {
                leaf.rotation.y += leaf.userData.speed;
                leaf.position.y += Math.sin(time * 0.5 + leaf.position.x) * 0.002;
            });

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(frameId);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, #f1f8f1 0%, #e8f5e9 100%)'
            }}
        />
    );
};

export default Dashboard3D;
