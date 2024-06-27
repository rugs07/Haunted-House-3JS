import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837',1,15)
scene.fog = fog

//Textures
const textureloader = new THREE.TextureLoader()
const bricktexture = textureloader.load('/textures/bricks/bricks.jpg')
const doortexture = textureloader.load('/textures/bricks/door.jpg')
const grasstexture = textureloader.load('/textures/bricks/grass.jpg')

// grasstexture.repeat.set(8,8)
// grasstexture.wrapS = THREE.RepeatWrapping
// grasstexture.wrapT = THREE.RepeatWrapping
//House
const house = new THREE.Group()
scene.add(house)

//Walls
const walls=  new THREE.Mesh(new THREE.BoxGeometry(4,2.5,4),new THREE.MeshStandardMaterial({
    map: bricktexture
}))
walls.position.y = 2.5/2
house.add(walls)

//Door
const door = new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshStandardMaterial({
    map: doortexture
}))
door.position.z = 2 + 0.01
door.position.y = 1
house.add(door)

//Bushes
const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})
const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)

bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.2)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1.25,0.05,2.26)

house.add(bush1,bush2,bush3,bush4)

//Graves
const graves = new THREE.Group()
scene.add(graves)

const gravegeom = new THREE.BoxGeometry(0.6,0.8,0.2)
const gravematerial = new THREE.MeshStandardMaterial({color : '#b2b6b1'})

for(let i =0;i<50;i++){
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random()*6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(gravegeom,gravematerial)
    grave.position.set(x,0.4,z)
    grave.rotation.y = (Math.random() - 0.5) * 1
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    graves.add(grave)
}


//roof
const roof = new THREE.Mesh(new THREE.ConeGeometry(3.5,1,4),new THREE.MeshStandardMaterial({color : '#b35f45'}))
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI/4
house.add(roof)


const floor = new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshStandardMaterial({
    map: grasstexture
}))
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 6
camera.position.z = 5
camera.lookAt(0, 0, 0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Lighting
 
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight,'intensity').min(0).max(1).step(0.001) // Soft white light
scene.add(ambientLight);

const moonlight = new THREE.DirectionalLight('#b9d5ff',0.12)
moonlight.position.set(4,5,-2)
gui.add(moonlight,'intensity').min(0).max(1).step(0.001)
gui.add(moonlight.position,'x').min(-5).max(5).step(0.001)
gui.add(moonlight.position,'y').min(-5).max(5).step(0.001)
gui.add(moonlight.position,'z').min(-5).max(5).step(0.001)
scene.add(moonlight)

//doorlight
const doorlight = new THREE.PointLight('#ff7d46',1,7)
doorlight.position.set(0,2.2,2.7)
house.add(doorlight)

//Ghosts

const ghost1 = new THREE.PointLight('#ff00ff',2,3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff',2,3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00',2,3)
scene.add(ghost3)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true

moonlight.castShadow = true
doorlight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
graves.castShadow = true
floor.receiveShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //Update Ghosts

    const ghsotangle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghsotangle) * 4
    ghost1.position.z = Math.sin(ghsotangle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghsotangle1 = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghsotangle1) * 5
    ghost2.position.z = Math.sin(ghsotangle1) * 5
    ghost2.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5)

    const ghsotangle2 = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghsotangle2) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghsotangle2) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5)
    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
