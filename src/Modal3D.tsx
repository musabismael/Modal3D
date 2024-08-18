import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { Audio, AudioLoader } from 'three';

const COLORS = {
  SKY_DAY: 0x87ceeb,
  SKY_NIGHT: 0x000033,
  GROUND: 0x88aa88,
  HOUSE_WALL: 0xcccccc,
  HOUSE_ROOF: 0x8b4513,
  TREE_TRUNK: 0x8b4513,
  TREE_LEAVES: 0x228b22,
};

const SKIN_TONES = {
  LIGHT: 0xffe0bd,
  MEDIUM: 0xd8a77b,
  DARK: 0x8d5524,
};

const CLOTHING_COLORS = {
  SHIRT: 0x3366cc,
  PANTS: 0x333333,
  DRESS: 0xff6699,
};

interface FamilyMemberProps {
  skinColor: number;
  position: [number, number, number];
  scale: number;
  hairColor: number;
  isMale: boolean;
  hairstyle: "short" | "long" | "bald";
  accessory?: "hat" | "glasses" | "none";
  clothingColor: number;
}

interface FamilySceneProps {
  hasSon: boolean;
  hasDaughter: boolean;
  hasWife: boolean;
  hasOther: boolean;
}

const FamilyScene: React.FC<FamilySceneProps> = ({
  hasSon,
  hasDaughter,
  hasWife,
  hasOther,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [selectedMember, setSelectedMember] = useState<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const createFamilyMember = ({
      skinColor,
      position,
      scale,
      hairColor,
      isMale,
      hairstyle,
      accessory,
      clothingColor,
    }: FamilyMemberProps) => {
      const group = new THREE.Group();

      const headGeometry = new THREE.SphereGeometry(0.25, 64, 64);
      const headMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.5 * scale;
      head.castShadow = true;
      head.name = "head";
      group.add(head);

      if (hairstyle !== "bald") {
        const hairGeometry = hairstyle === "short"
          ? new THREE.SphereGeometry(0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2)
          : new THREE.SphereGeometry(0.28, 32, 32);
        const hairMaterial = new THREE.MeshPhongMaterial({ color: hairColor });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = hairstyle === "short" ? 1.63 * scale : 1.58 * scale;
        hair.castShadow = true;
        group.add(hair);
      }

      const eyeGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const irisGeometry = new THREE.SphereGeometry(0.03, 32, 32);
      const irisMaterial = new THREE.MeshPhongMaterial({ color: 0x4B0082 });

      const leftEye = new THREE.Group();
      const leftEyeball = new THREE.Mesh(eyeGeometry, eyeMaterial);
      const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
      leftIris.position.z = 0.02;
      leftEye.add(leftEyeball, leftIris);
      leftEye.position.set(-0.1, 1.55 * scale, 0.18);
      group.add(leftEye);

      const rightEye = leftEye.clone();
      rightEye.position.set(0.1, 1.55 * scale, 0.18);
      group.add(rightEye);

      const neckGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.2, 32);
      const neckMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
      const neck = new THREE.Mesh(neckGeometry, neckMaterial);
      neck.position.y = 1.35 * scale;
      neck.castShadow = true;
      group.add(neck);

      const torsoGeometry = new THREE.CylinderGeometry(0.3, isMale ? 0.4 : 0.45, 0.8, 32);
      const torsoMaterial = new THREE.MeshPhongMaterial({ color: clothingColor });
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
      torso.position.y = 0.9 * scale;
      torso.castShadow = true;
      group.add(torso);

      const createArm = (isLeft: boolean) => {
        const armGroup = new THREE.Group();

        const upperArmGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.4, 32);
        const upperArm = new THREE.Mesh(upperArmGeometry, torsoMaterial);
        upperArm.position.y = -0.2;
        upperArm.castShadow = true;
        armGroup.add(upperArm);

        const elbowGeometry = new THREE.SphereGeometry(0.06, 32, 32);
        const elbow = new THREE.Mesh(elbowGeometry, torsoMaterial);
        elbow.position.y = -0.4;
        elbow.castShadow = true;
        armGroup.add(elbow);

        const forearmGeometry = new THREE.CylinderGeometry(0.06, 0.04, 0.4, 32);
        const forearm = new THREE.Mesh(forearmGeometry, torsoMaterial);
        forearm.position.y = -0.6;
        forearm.castShadow = true;
        armGroup.add(forearm);

        const handGeometry = new THREE.SphereGeometry(0.06, 32, 32);
        const handMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
        const hand = new THREE.Mesh(handGeometry, handMaterial);
        hand.position.y = -0.8;
        hand.castShadow = true;
        armGroup.add(hand);

        armGroup.position.set(isLeft ? -0.4 : 0.4, 1.3 * scale, 0);
        armGroup.rotation.z = isLeft ? Math.PI / 16 : -Math.PI / 16;
        return armGroup;
      };

      const leftArm = createArm(true);
      leftArm.name = "leftArm";
      const rightArm = createArm(false);
      rightArm.name = "rightArm";
      group.add(leftArm, rightArm);

      const createLeg = (isLeft: boolean) => {
        const legGroup = new THREE.Group();

        const legGeometry = new THREE.CylinderGeometry(0.12, 0.1, 1, 32);
        const legMaterial = new THREE.MeshPhongMaterial({
          color: isMale ? CLOTHING_COLORS.PANTS : clothingColor,
        });
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.y = -0.5;
        leg.castShadow = true;
        legGroup.add(leg);

        const footGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.25);
        const footMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const foot = new THREE.Mesh(footGeometry, footMaterial);
        foot.position.set(0, -1.05, 0.05);
        foot.castShadow = true;
        legGroup.add(foot);

        legGroup.position.set(isLeft ? -0.2 : 0.2, 0.5 * scale, 0);
        return legGroup;
      };

      const leftLeg = createLeg(true);
      const rightLeg = createLeg(false);
      group.add(leftLeg, rightLeg);

      if (accessory === "glasses") {
        const glassesGeometry = new THREE.TorusGeometry(0.1, 0.02, 16, 100);
        const glassesMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const leftLens = new THREE.Mesh(glassesGeometry, glassesMaterial);
        leftLens.position.set(-0.1, 1.55 * scale, 0.2);
        leftLens.rotation.y = Math.PI / 2;
        group.add(leftLens);
        const rightLens = new THREE.Mesh(glassesGeometry, glassesMaterial);
        rightLens.position.set(0.1, 1.55 * scale, 0.2);
        rightLens.rotation.y = Math.PI / 2;
        group.add(rightLens);
      } else if (accessory === "hat") {
        const hatGeometry = new THREE.ConeGeometry(0.3, 0.3, 32);
        const hatMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.y = 1.8 * scale;
        hat.castShadow = true;
        group.add(hat);
      }

      group.scale.set(scale * 2, scale * 2, scale * 2);
      group.position.set(...position);
      return group;
    };

    const familyMembers: THREE.Group[] = [];

    if (hasWife) {
      const mother = createFamilyMember({
        skinColor: SKIN_TONES.MEDIUM,
        position: [-3, 10, 0],
        scale: 0.9,
        hairColor: 0x8b4513,
        isMale: false,
        hairstyle: "long",
        accessory: "glasses",
        clothingColor: CLOTHING_COLORS.DRESS,
      });
      familyMembers.push(mother);
    }

    const father = createFamilyMember({
      skinColor: SKIN_TONES.DARK,
      position: [3, 10, 0],
      scale: 1,
      hairColor: 0x000000,
      isMale: true,
      hairstyle: "short",
      accessory: "hat",
      clothingColor: CLOTHING_COLORS.SHIRT,
    });
    familyMembers.push(father);

    if (hasSon) {
      const son = createFamilyMember({
        skinColor: SKIN_TONES.MEDIUM,
        position: [-1, 10, 2],
        scale: 0.7,
        hairColor: 0x8b4513,
        isMale: true,
        hairstyle: "short",
        clothingColor: 0x00ff00,
      });
      familyMembers.push(son);
    }

    if (hasDaughter) {
      const daughter = createFamilyMember({
        skinColor: SKIN_TONES.LIGHT,
        position: [1, 10, 2],
        scale: 0.6,
        hairColor: 0xffd700,
        isMale: false,
        hairstyle: "long",
        clothingColor: 0xff00ff,
      });
      familyMembers.push(daughter);
    }

    familyMembers.forEach((member, index) => {
      scene.add(member);
      gsap.to(member.position, {
        y: 0,
        duration: 1,
        delay: index * 0.5,
        ease: "bounce.out",
      });
    });

    const groundGeometry = new THREE.PlaneGeometry(100, 100, 200, 200);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: COLORS.GROUND,
      vertexColors: true 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;

    const colors = [];
    for (let i = 0; i < groundGeometry.attributes.position.count; i++) {
      if (Math.random() > 0.6) {
        colors.push(0, 0.5 + Math.random() * 0.5, 0);
      } else {
        colors.push(0.6, 0.4, 0.2);
      }
    }
    groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    scene.add(ground);

    for (let i = 0; i < 2000; i++) {
      const grassGeometry = new THREE.PlaneGeometry(0.1, 0.3);
      const grassMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide 
      });
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.set(
        Math.random() * 100 - 50,
        0,
        Math.random() * 100 - 50
      );
      grass.rotation.y = Math.random() * Math.PI;
      scene.add(grass);
    }

    const createHouse = () => {
      const house = new THREE.Group();

      const wallGeometry = new THREE.BoxGeometry(6, 4, 4);
      const wallMaterial = new THREE.MeshPhongMaterial({ color: COLORS.HOUSE_WALL });
      const walls = new THREE.Mesh(wallGeometry, wallMaterial);
      walls.castShadow = true;
      walls.receiveShadow = true;
      house.add(walls);

      const roofGeometry = new THREE.ConeGeometry(5, 2, 4);
      const roofMaterial = new THREE.MeshPhongMaterial({ color: COLORS.HOUSE_ROOF });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 3;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);

      const doorGeometry = new THREE.PlaneGeometry(1.6, 3);
      const doorMaterial = new THREE.MeshPhongMaterial({ color: COLORS.HOUSE_ROOF });
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.set(0, -0.5, 2.01);
      house.add(door);

      const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x87ceeb });
      const windowGeometry = new THREE.PlaneGeometry(1, 1);
      
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.position.set(-2, 0.5, 2.01);
      house.add(leftWindow);
      const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rightWindow.position.set(2, 0.5, 2.01);
      house.add(rightWindow);

      house.position.set(-10, 0, -5);
      return house;
    };

    const house = createHouse();
    scene.add(house);

    const createTree = (x: number, z: number) => {
      const tree = new THREE.Group();

      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
      const trunkMaterial = new THREE.MeshPhongMaterial({ color: COLORS.TREE_TRUNK });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.castShadow = true;
      tree.add(trunk);

      const leavesGeometry = new THREE.SphereGeometry(1, 8, 8);
      const leavesMaterial = new THREE.MeshPhongMaterial({ color: COLORS.TREE_LEAVES });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 1.5;
      leaves.castShadow = true;
      tree.add(leaves);

      tree.position.set(x, 0, z);
      return tree;
    };

    const trees = [
      createTree(8, -8),
      createTree(-8, 8),
      createTree(12, 5),
      createTree(-12, -5),
    ];
    trees.forEach((tree) => scene.add(tree));

    const createCloud = (x: number, y: number, z: number) => {
      const cloud = new THREE.Group();
      const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      for (let i = 0; i < 10; i++) {
        const cloudPart = new THREE.Mesh(new THREE.SphereGeometry(0.8 + Math.random() * 0.3, 16, 16), cloudMaterial);
        cloudPart.position.set(Math.random() * 2 - 1, Math.random() * 1 - 0.5, Math.random() * 2 - 1);
        cloud.add(cloudPart);
      }
      cloud.position.set(x, y, z);
      return cloud;
    };

    const clouds = [
      createCloud(5, 10, -10),
      createCloud(-8, 12, -5),
      createCloud(10, 11, -8),
      createCloud(-12, 13, 0),
      createCloud(15, 11, 5),
      createCloud(-5, 12, 10),
      createCloud(0, 14, -15),
    ];
    clouds.forEach(cloud => scene.add(cloud));

    const createMountain = (x: number, z: number, height: number) => {
      const mountainGeometry = new THREE.ConeGeometry(8, height, 32);
      const mountainMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x808080,
        flatShading: true 
      });
      const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
      mountain.position.set(x, height / 2, z);
      mountain.castShadow = true;
      
      return mountain;
    };

    const mountains = [
      createMountain(-25, -25, 15),
      createMountain(25, -20, 12),
      createMountain(-20, 25, 18),
    ];
    mountains.forEach(mountain => scene.add(mountain));

    const createFlower = (x: number, z: number) => {
      const flower = new THREE.Group();
      const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
      const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      flower.add(stem);

      const petalGeometry = new THREE.CircleGeometry(0.2, 5);
      const petalMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
      for (let i = 0; i < 5; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.y = 0.25;
        petal.rotation.x = -Math.PI / 2;
        petal.rotation.y = (i / 5) * Math.PI * 2;
        flower.add(petal);
      }

      flower.position.set(x, 0, z);
      return flower;
    };

    for (let i = 0; i < 50; i++) {
      const flower = createFlower(Math.random() * 40 - 20, Math.random() * 40 - 20);
      scene.add(flower);
    }

    const createRoad = () => {
      const roadGroup = new THREE.Group();
      const laneWidth = 2;
      const roadLength = 60;

      for (let i = 0; i < 2; i++) {
        const laneGeometry = new THREE.PlaneGeometry(roadLength, laneWidth, 100, 1);
        const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
        const lane = new THREE.Mesh(laneGeometry, roadMaterial);
        lane.rotation.x = -Math.PI / 2;
        lane.position.set(0, 0.1, 10 + (i * 3 - 1.5));
        roadGroup.add(lane);

        const markingGeometry = new THREE.PlaneGeometry(1, 0.1);
        const markingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        for (let j = -29; j < 30; j += 4) {
          const marking = new THREE.Mesh(markingGeometry, markingMaterial);
          marking.rotation.x = -Math.PI / 2;
          marking.position.set(j, 0.11, 10 + (i * 3 - 1.5));
          roadGroup.add(marking);
        }
      }

      return roadGroup;
    };

    const road = createRoad();
    scene.add(road);

    const createCar = (color: number) => {
      const car = new THREE.Group();
      
      const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      car.add(body);

      const roofGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.9);
      const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
      roof.position.set(-0.1, 0.45, 0);
      car.add(roof);

      const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
      const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
      const wheelPositions = [
        [-0.7, -0.25, 0.5],
        [0.7, -0.25, 0.5],
        [-0.7, -0.25, -0.5],
        [0.7, -0.25, -0.5]
      ];
      wheelPositions.forEach(position => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...position);
        car.add(wheel);
      });

      return car;
    };

    const cars: THREE.Group[] = [];
    const addCarsToRoad = () => {
      const carColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
      for (let i = 0; i < 5; i++) {
        const car = createCar(carColors[i]);
        const lane = i % 2;
        car.position.set(Math.random() * 50 - 25, 0.3, 10 + (lane * 3 - 1.5));
        car.rotation.y = lane === 0 ? 0 : Math.PI;
        scene.add(car);
        cars.push(car);
      }
    };

    addCarsToRoad();

    const createFence = () => {
      const fence = new THREE.Group();
      const fencePostGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
      const fencePostMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const fenceRailGeometry = new THREE.BoxGeometry(2, 0.1, 0.05);
      const fenceRailMaterial = new THREE.MeshPhongMaterial({ color: 0xA0522D });

      for (let i = 0; i < 8; i++) {
        const post = new THREE.Mesh(fencePostGeometry, fencePostMaterial);
        post.position.set(-7 + i * 2, 0.5, -3);
        fence.add(post);

        if (i < 7) {
          const rail = new THREE.Mesh(fenceRailGeometry, fenceRailMaterial);
          rail.position.set(-6 + i * 2, 0.8, -3);
          fence.add(rail);
        }
      }

      return fence;
    };

    const fence = createFence();
    scene.add(fence);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const audioLoader = new AudioLoader();
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new Audio(listener);

    audioLoader.load('path/to/background_music.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    const createSound = (path: string, loop: boolean = false, volume: number = 1) => {
      const sound = new Audio(listener);
      audioLoader.load(path, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(loop);
        sound.setVolume(volume);
      });
      return sound;
    };

    const windSound = createSound('path/to/wind_sound.mp3', true, 0.2);
    const birdSound = createSound('path/to/bird_chirping.mp3', true, 0.1);

    windSound.play();
    birdSound.play();

    const playInteractionSound = () => {
      const interactionSound = new Audio(listener);
      audioLoader.load('path/to/interaction_sound.mp3', (buffer) => {
        interactionSound.setBuffer(buffer);
        interactionSound.setVolume(0.7);
        interactionSound.play();
      });
    };

    const moveCameraToMember = (member: THREE.Group) => {
      const targetPosition = member.position.clone().add(new THREE.Vector3(0, 2, 5));
      gsap.to(camera.position, {
        duration: 2,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        onUpdate: () => {
          camera.lookAt(member.position);
        },
        onComplete: () => {
          playInteractionSound();
        }
      });
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(familyMembers, true);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        const familyMember = selectedObject.parent;
        if (familyMember instanceof THREE.Group) {
          setSelectedMember(familyMember);
          moveCameraToMember(familyMember);
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    const animateFamilyMember = (member: THREE.Group) => {
      const head = member.getObjectByName('head');
      const leftArm = member.getObjectByName('leftArm');
      const rightArm = member.getObjectByName('rightArm');

      if (head && leftArm && rightArm) {
        gsap.to(head.rotation, {
          y: Math.PI / 6,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });
        gsap.to(leftArm.rotation, {
          x: Math.PI / 4,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });

        gsap.to(rightArm.rotation, {
          x: -Math.PI / 4,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });
      }
    };

    familyMembers.forEach(animateFamilyMember);

    const animateClouds = () => {
      clouds.forEach((cloud, index) => {
        cloud.position.x += Math.sin(Date.now() * 0.001 + index) * 0.02;
        cloud.position.y += Math.cos(Date.now() * 0.002 + index) * 0.01;
        
        // Wrap clouds around when they move too far
        if (cloud.position.x > 50) cloud.position.x = -50;
        if (cloud.position.x < -50) cloud.position.x = 50;
      });
    };

    const animateCars = () => {
      cars.forEach((car, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        car.position.x += 0.1 * direction;
        
        // Wrap cars around when they move too far
        if (car.position.x > 30) car.position.x = -30;
        if (car.position.x < -30) car.position.x = 30;
      });
    };

    const createSky = () => {
      const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
      const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color(0x0077ff) },
          bottomColor: { value: new THREE.Color(0xffffff) },
          offset: { value: 33 },
          exponent: { value: 0.6 }
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
          }
        `,
        side: THREE.BackSide
      });
      return new THREE.Mesh(skyGeometry, skyMaterial);
    };

    const sky = createSky();
    scene.add(sky);

    let time = 0;
    const updateDayNightCycle = () => {
      time += 0.001;
      const dayColor = new THREE.Color(0x87CEEB);
      const nightColor = new THREE.Color(0x000033);
      const currentColor = dayColor.lerp(nightColor, Math.sin(time) * 0.5 + 0.5);
      sky.material.uniforms.topColor.value = currentColor;
      directionalLight.intensity = Math.cos(time) * 0.5 + 0.5;
    };

    const createParticleSystem = (texture, count, size, area) => {
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = Math.random() * area.x - area.x / 2;
        positions[i + 1] = Math.random() * area.y;
        positions[i + 2] = Math.random() * area.z - area.z / 2;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: size,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      });

      return new THREE.Points(particles, material);
    };

    const fireflyTexture = new THREE.TextureLoader().load('path/to/firefly_texture.png');
    const fireflies = createParticleSystem(fireflyTexture, 100, 0.1, { x: 40, y: 10, z: 40 });
    scene.add(fireflies);

    const createRainSystem = () => {
      const rainGeometry = new THREE.BufferGeometry();
      const rainCount = 15000;
      const positions = new Float32Array(rainCount * 3);

      for (let i = 0; i < rainCount * 3; i += 3) {
        positions[i] = Math.random() * 400 - 200;
        positions[i + 1] = Math.random() * 500 - 250;
        positions[i + 2] = Math.random() * 400 - 200;
      }

      rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true
      });

      return new THREE.Points(rainGeometry, rainMaterial);
    };

    const rain = createRainSystem();
    scene.add(rain);

    const animateRain = () => {
      const positions = rain.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.1 + Math.random() * 0.1;
        if (positions[i] < -250) {
          positions[i] = 250;
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      animateClouds();
      animateCars();
      updateDayNightCycle();
      animateRain();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [hasSon, hasDaughter, hasWife, hasOther]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh' }}>
      {loadingProgress < 100 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          color: 'white',
        }}>
          Loading: {loadingProgress}%
        </div>
      )}
    </div>
  );
};

export default FamilyScene;
