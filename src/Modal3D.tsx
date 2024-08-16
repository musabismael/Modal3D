import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

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
  const [selectedMember, setSelectedMember] = useState<THREE.Group | null>(
    null
  );

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.SKY_DAY);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

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

      const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
      const headMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.5 * scale;
      head.castShadow = true;
      head.name = "head";
      group.add(head);

      if (hairstyle !== "bald") {
        const hairGeometry =
          hairstyle === "short"
            ? new THREE.SphereGeometry(
                0.26,
                32,
                32,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
              )
            : new THREE.SphereGeometry(0.28, 32, 32);
        const hairMaterial = new THREE.MeshPhongMaterial({ color: hairColor });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = hairstyle === "short" ? 1.63 * scale : 1.58 * scale;
        hair.castShadow = true;
        group.add(hair);
      }

      const eyeGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.1, 1.55 * scale, 0.18);
      group.add(leftEye);
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.1, 1.55 * scale, 0.18);
      group.add(rightEye);

      const pupilGeometry = new THREE.SphereGeometry(0.02, 32, 32);
      const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      leftPupil.position.set(-0.1, 1.55 * scale, 0.22);
      group.add(leftPupil);
      const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      rightPupil.position.set(0.1, 1.55 * scale, 0.22);
      group.add(rightPupil);

      if (accessory === "glasses") {
        const glassesGeometry = new THREE.TorusGeometry(0.1, 0.02, 16, 100);
        const glassesMaterial = new THREE.MeshPhongMaterial({
          color: 0x000000,
        });
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

      const neckGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.2, 32);
      const neckMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
      const neck = new THREE.Mesh(neckGeometry, neckMaterial);
      neck.position.y = 1.35 * scale;
      neck.castShadow = true;
      group.add(neck);

      const torsoGeometry = new THREE.CylinderGeometry(
        0.3,
        isMale ? 0.4 : 0.45,
        0.8,
        32
      );
      const torsoMaterial = new THREE.MeshPhongMaterial({
        color: clothingColor,
      });
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
      torso.position.y = 0.9 * scale;
      torso.castShadow = true;
      group.add(torso);

      const createArm = (isLeft: boolean) => {
        const armGroup = new THREE.Group();

        const upperArmGeometry = new THREE.CylinderGeometry(
          0.08,
          0.06,
          0.4,
          32
        );
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

      group.scale.set(scale, scale, scale);
      group.position.set(...position);
      return group;
    };

    const familyMembers: THREE.Group[] = [];

    if (hasWife) {
      const mother = createFamilyMember({
        skinColor: SKIN_TONES.MEDIUM,
        position: [-1.5, 10, 0],
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
      position: [1.5, 10, 0],
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
        position: [-0.5, 10, 1],
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
        position: [0.5, 10, 1],
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

    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: COLORS.GROUND,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const createHouse = () => {
      const house = new THREE.Group();

      const wallGeometry = new THREE.BoxGeometry(3, 2, 2);
      const wallMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.HOUSE_WALL,
      });
      const walls = new THREE.Mesh(wallGeometry, wallMaterial);
      walls.castShadow = true;
      walls.receiveShadow = true;
      house.add(walls);

      const roofGeometry = new THREE.ConeGeometry(2.5, 1, 4);
      const roofMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.HOUSE_ROOF,
      });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 1.5;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);

      const doorGeometry = new THREE.PlaneGeometry(0.8, 1.5);
      const doorMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.HOUSE_ROOF,
      });
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.set(0, -0.25, 1.01);
      house.add(door);

      const windowGeometry = new THREE.PlaneGeometry(0.5, 0.5);
      const windowMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaff });
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.position.set(-0.8, 0.2, 1.01);
      house.add(leftWindow);
      const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rightWindow.position.set(0.8, 0.2, 1.01);
      house.add(rightWindow);

      house.position.set(0, 0.5, -3);
      return house;
    };

    const house = createHouse();
    scene.add(house);

    const createTree = (x: number, z: number) => {
      const tree = new THREE.Group();

      const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
      const trunkMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.TREE_TRUNK,
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.castShadow = true;
      tree.add(trunk);

      const leavesGeometry = new THREE.ConeGeometry(0.5, 1, 8);
      const leavesMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.TREE_LEAVES,
      });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 1;
      leaves.castShadow = true;
      tree.add(leaves);

      tree.position.set(x, 0, z);
      return tree;
    };

    const trees = [
      createTree(-3, -3),
      createTree(3, -3),
      createTree(-3, 3),
      createTree(3, 3),
    ];
    trees.forEach((tree) => scene.add(tree));

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    camera.position.set(0, 3, 8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const loader = new GLTFLoader();
    loader.load(
      "path/to/your/3d/model.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, 2);
        scene.add(model);
        setLoadingProgress(100);
      },
      (xhr) => {
        setLoadingProgress((xhr.loaded / xhr.total) * 100);
      },
      (error) => {
        console.error("An error happened", error);
      }
    );

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      familyMembers.forEach((member, index) => {
        member.position.y += Math.sin(time + index) * 0.001;
        member.rotation.y = Math.sin(time * 0.5 + index) * 0.1;

        const rightArm = member.getObjectByName("rightArm");
        if (rightArm) {
          rightArm.rotation.z = Math.sin(time * 2 + index) * 0.2;
        }

        const head = member.getObjectByName("head");
        if (head) {
          head.rotation.y = Math.sin(time * 1.5 + index) * 0.1;
        }
      });

      trees.forEach((tree, index) => {
        tree.rotation.y = Math.sin(time * 0.2 + index) * 0.05;
      });

      const dayColor = new THREE.Color(COLORS.SKY_DAY);
      const nightColor = new THREE.Color(COLORS.SKY_NIGHT);
      const currentColor = new THREE.Color();

      currentColor
        .copy(dayColor)
        .lerp(nightColor, Math.sin(time * 0.1) * 0.5 + 0.5);
      scene.background = currentColor;

      directionalLight.intensity = Math.cos(time * 0.1) * 0.5 + 0.5;
      ambientLight.intensity = Math.cos(time * 0.1) * 0.25 + 0.25;

      setIsNight(Math.sin(time * 0.1) > 0);

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(familyMembers, true);

      if (intersects.length > 0) {
        const clickedMember = intersects[0].object.parent;
        if (clickedMember && clickedMember instanceof THREE.Group) {
          setSelectedMember(clickedMember);
        }
      }
    };
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [hasSon, hasDaughter, hasWife, hasOther]);

  return (
    <div>
      <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />
      {loadingProgress < 100 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          Loading: {loadingProgress.toFixed(2)}%
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "white",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        {isNight ? "Night Time" : "Day Time"}
      </div>
      {selectedMember && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            color: "white",
            background: "rgba(0, 0, 0, 0.5)",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          Selected: {selectedMember.name || "Family Member"}
        </div>
      )}
    </div>
  );
};

export default FamilyScene;
