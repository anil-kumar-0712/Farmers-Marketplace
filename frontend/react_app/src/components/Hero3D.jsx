import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero3D = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // --- ENHANCED HELPERS ---
        const createLeaf = (color = 0x4ade80, scale = 1) => {
            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0);
            leafShape.bezierCurveTo(0.6, 0.6, 0.6, 1.5, 0, 1.8);
            leafShape.bezierCurveTo(-0.6, 1.5, -0.6, 0.6, 0, 0);

            const geometry = new THREE.ExtrudeGeometry(leafShape, {
                depth: 0.08, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05
            });
            const material = new THREE.MeshStandardMaterial({
                color,
                roughness: 0.4,
                emissive: color,
                emissiveIntensity: 0.3
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(scale, scale, scale);
            return mesh;
        };

        const createFlower = (color = 0xf87171) => {
            const group = new THREE.Group();
            const centerGeom = new THREE.SphereGeometry(0.2, 16, 16);
            const centerMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 0.5 });
            group.add(new THREE.Mesh(centerGeom, centerMat));

            const petalGeom = new THREE.ConeGeometry(0.12, 0.5, 8);
            const petalMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4 });
            for (let i = 0; i < 8; i++) {
                const petal = new THREE.Mesh(petalGeom, petalMat);
                petal.position.x = Math.cos((i / 8) * Math.PI * 2) * 0.25;
                petal.position.y = Math.sin((i / 8) * Math.PI * 2) * 0.25;
                petal.rotation.z = (i / 8) * Math.PI * 2 - Math.PI / 2;
                group.add(petal);
            }
            return group;
        };

        const createFarmer = (color = 0x1f2937) => {
            const group = new THREE.Group();
            const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });

            const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
            head.position.y = 1.2;
            group.add(head);

            const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.6, 4, 8), mat);
            body.position.y = 0.6;
            group.add(body);

            const hat = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.2, 16), new THREE.MeshStandardMaterial({
                color: 0x92400e, emissive: 0x451a03, emissiveIntensity: 0.6
            }));
            hat.position.y = 1.4;
            group.add(hat);

            return group;
        };

        // --- ASSEMBLE RICH GARDEN ---
        const worldGroup = new THREE.Group();

        // Background Plants (Large Leaves)
        for (let i = 0; i < 12; i++) {
            const leaf = createLeaf(i % 3 === 0 ? 0x064e3b : 0x166534, 0.8 + Math.random() * 0.7);
            leaf.position.set(Math.random() * 10 - 5, Math.random() * 8 - 4, -5 - Math.random() * 5);
            leaf.rotation.set(Math.random(), Math.random(), Math.random());
            leaf.userData = { speed: Math.random() * 0.01, float: Math.random() * 2 };
            worldGroup.add(leaf);
        }

        // Foreground Flowers
        for (let i = 0; i < 15; i++) {
            const colors = [0xf87171, 0x60a5fa, 0xf472b6, 0xfbbf24];
            const flower = createFlower(colors[i % colors.length]);
            flower.position.set(Math.random() * 12 - 6, Math.random() * 10 - 5, Math.random() * 4 - 2);
            flower.scale.set(0.6, 0.6, 0.6);
            flower.userData = { speed: Math.random() * 0.02, float: Math.random() * 2 };
            worldGroup.add(flower);
        }

        // Multiple Farmers at various depths
        const farmerPos = [[-3, -1, -3], [3, 1, -4], [0, -3, -2]];
        farmerPos.forEach((pos, i) => {
            const farmer = createFarmer();
            farmer.position.set(...pos);
            farmer.scale.set(1.2, 1.2, 1.2);
            farmer.rotation.y = Math.PI / 4 * (i % 2 ? 1 : -1);
            worldGroup.add(farmer);
        });

        scene.add(worldGroup);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const pLight = new THREE.PointLight(0xffffff, 1.5);
        pLight.position.set(5, 5, 10);
        scene.add(pLight);

        camera.position.z = 8;

        // --- ANIMATION ---
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = Date.now() * 0.001;

            worldGroup.children.forEach((obj, i) => {
                obj.rotation.y += obj.userData.speed || 0.005;
                obj.position.y += Math.sin(time + (obj.userData.float || 0)) * 0.005;
            });

            worldGroup.rotation.y = Math.sin(time * 0.1) * 0.05;
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
            cancelAnimationFrame(frameId);
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};

export default Hero3D;
