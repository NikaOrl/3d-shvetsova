import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from './three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from './three/src/Three.js';

let renderer, controls, scene, camera;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

init();
animate();

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  // gamma
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2; // approximate sRGB
  // scene
  scene = new THREE.Scene();
  // camera
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.rotation.x = -Math.PI / 6;

  camera.position.set(0, 0, 50);

  addBase(0, 0xe02e3f); // base 1 // moved to 0

  // green cylinder
  var geometry = new THREE.CylinderGeometry(5, 5, 15, 32); // radiusTop?: number, radiusBottom?: number, height?: number, radiusSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number
  // geometry.translate(15, 15, 0);
  var material = new THREE.MeshBasicMaterial({ color: 0xff19 });
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.rotation.x = Math.PI / 2;
  cylinder.rotation.z = Math.PI / 3;
  scene.add(cylinder);

  // blue cylinder
  var geometry = new THREE.CylinderGeometry(3, 2, 5, 32); // radiusTop?: number, radiusBottom?: number, height?: number, radiusSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number
  geometry.translate(-4, 7.5, 2);
  var material = new THREE.MeshBasicMaterial({ color: 0x1b9cbd });
  var cylinder = new THREE.Mesh(geometry, material);
  // cylinder.rotation.x = Math.PI / 2;
  // cylinder.rotation.z = Math.PI / 3;
  scene.add(cylinder);

  // red-blue cube
  var geometry_cube = new THREE.BoxGeometry(6.5, 13, 6.5);
  geometry_cube.translate(12.5, 1, 0);
  var material = new THREE.MeshBasicMaterial({ color: 0xe02e3f });
  var cube = new THREE.Mesh(geometry_cube, material);
  cube.rotation.x = 0;
  cube.rotation.y = Math.PI / 6;
  cube.rotation.z = 0;
  scene.add(cube);

  // yellow half-cylinder
  var geometry = new THREE.CylinderGeometry(
    4,
    4,
    10,
    32,
    1,
    false,
    Math.PI / 2,
    Math.PI
  );
  geometry.translate(0, -13, -5.5);
  var material = new THREE.MeshBasicMaterial({ color: 0xfdcc30 });
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.rotation.x = Math.PI / 2;
  cylinder.rotation.z = Math.PI / 3;
  scene.add(cylinder);

  addBase(28, 0x1b9cbd); // base 2 // moved to 28

  // green-blue-yellow cube
  var geometry_cube = new THREE.BoxGeometry(20, 13, 6.5);
  geometry_cube.translate(34, 1, 0);
  var material = new THREE.MeshBasicMaterial({ color: 0xfdcc30 });
  var cube = new THREE.Mesh(geometry_cube, material);
  cube.rotation.x = 0;
  cube.rotation.y = Math.PI / 6;
  cube.rotation.z = 0;
  scene.add(cube);

  addBase(56, 0xe02e3f); // base 3 // moved to 56

  // green cube
  var geometry_cube = new THREE.BoxGeometry(20, 13, 6.5);
  geometry_cube.translate(62, 1, 0);
  var material = new THREE.MeshBasicMaterial({ color: 0xff19 });
  var cube = new THREE.Mesh(geometry_cube, material);
  cube.rotation.x = 0;
  cube.rotation.y = Math.PI / 6;
  cube.rotation.z = 0;
  scene.add(cube);

  // blue half-cylinder
  var geometry = new THREE.CylinderGeometry(
    4,
    4,
    22,
    32,
    1,
    false,
    Math.PI / 2,
    Math.PI
  );
  geometry.translate(0, -62, -5.5);
  var material = new THREE.MeshBasicMaterial({ color: 0x1b9cbd });
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.rotation.x = Math.PI / 2;
  cylinder.rotation.z = Math.PI / 3;
  scene.add(cylinder);

  // rotation controls
  var orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.addEventListener('change', render);
  orbitControls.minDistance = -100;
  orbitControls.maxDistance = 100;
  orbitControls.enablePan = false;

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  // moving controls
  var onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
    }
  };
  var onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  var time = performance.now();
  var delta = (time - prevTime) / 1000;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize(); // this ensures consistent movements in all directions
  if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  prevTime = time;
  render();
}

function addBase(xOption, wheelColor) {
  var geometry_cube = new THREE.BoxGeometry(25, 5, 10);
  geometry_cube.translate(5 + xOption, -7.5, 0);
  var material = new THREE.MeshBasicMaterial({ color: 0xfbceae });
  var cube = new THREE.Mesh(geometry_cube, material);
  cube.rotation.x = 0;
  cube.rotation.y = Math.PI / 6;
  cube.rotation.z = 0;
  scene.add(cube);

  addWheel(xOption, 6.5, wheelColor);
  addWheel(xOption, -6.5, wheelColor);
  addWheel(xOption + 15, 6.5, wheelColor);
  addWheel(xOption + 15, -6.5, wheelColor);
}

function addWheel(xOption, yOption, color) {
  var geometry = new THREE.CylinderGeometry(4.5, 4.5, 3, 32); // radiusTop?: number, radiusBottom?: number, height?: number, radiusSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number
  geometry.translate(-2 + xOption, yOption, 7.5);
  var material = new THREE.MeshBasicMaterial({ color: color });
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.rotation.x = Math.PI / 2;
  cylinder.rotation.z = -Math.PI / 6;
  scene.add(cylinder);
}
