import './style.css';
import earth from './images/earth.jpg';
import circle from './images/ring.jpg';
import space from './images/space.jpg';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.SphereGeometry(10, 50, 10);
const texture = new THREE.TextureLoader().load(earth);
const material = new THREE.MeshStandardMaterial({
  // color: 0x0000ff,
  // wireframe: true,
  map: texture,
});
const object = new THREE.Mesh(geometry, material);

scene.add(object);

const geometry2 = new THREE.TorusGeometry(15, 1.5, 4, 200);
const texture2 = new THREE.TextureLoader().load(circle);
const material2 = new THREE.MeshStandardMaterial({
  // color: 0xe89714,
  // wireframe: true,
  map: texture2,
});
const ring = new THREE.Mesh(geometry2, material2);

scene.add(ring);
ring.position.set(0, 0, 0);
ring.rotation.x = Math.PI / 2;
ring.rotation.x -= 50;
ring.rotation.y = -50;

const light = new THREE.PointLight(0xffffff);
light.position.set(-25, 20, 30);
const dark = new THREE.PointLight(0x303030);
dark.position.set(25, -20, -30);
scene.add(light, dark);

// const gridHelper = new THREE.GridHelper(150, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(asteroid) {
  const geometry = new THREE.SphereGeometry(asteroid ? 1 : 0.25, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: asteroid ? 0x505050 : 0xffffff, });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
  if (asteroid) {
    setInterval(() => {
      star.position.y -= Math.random();
      star.position.z += Math.random();
      star.position.x += Math.random();
    }, 1);
    setTimeout(() => {
      scene.remove(star);
    }, 5000);
  }
}

Array(250).fill().forEach(() => addStar(false));
// setInterval(() => Array(1).fill().forEach(() => addStar(true)), 1000);

const bg = new THREE.TextureLoader().load(space);
scene.background = bg;

let speed = 0.005;
function animate() {
  requestAnimationFrame(animate);

  object.rotation.y += speed;
  ring.rotation.z += speed * 5;
  controls.update();

  renderer.render(scene, camera);
}

animate();

document.querySelector('#star').onclick = addStar;

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyO') {
    addStar(true);
  } else if (event.code === 'KeyW') {
    camera.position.z -= 0.5;
  } else if (event.code === 'KeyS') {
    camera.position.z += 0.5;
  } else if (event.code === 'KeyA') {
    camera.position.x -= 0.5;
  } else if (event.code === 'KeyD') {
    camera.position.x += 0.5;
  } else if (event.code === 'Space') {
    camera.position.y += 0.5;
  } else if (event.key === 'Shift') {
    camera.position.y -= 0.5;
  }
});
