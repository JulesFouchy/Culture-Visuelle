import * as THREE from 'three';
import* as TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';
 
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { ViewControls }  from './ViewControls.ts';
import { Vector3 } from 'three';
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

const App = function () {

    const scope = this;

    // Global variables
    const scene: THREE.Scene = new THREE.Scene();
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    let camera: THREE.PerspectiveCamera;
    let controls: ViewControls;

    const raycaster: THREE.Raycaster = new THREE.Raycaster();
    // let intersects = [];

    // Options to be added to the GUI
    const options = {
        particlesCount: 1000,
        maxParticles : 10000,
        animate: true,
        speed : 0.5,
    };
    const gui = new dat.GUI();

    let mouse: THREE.Vector2 = new THREE.Vector2();

    // Scene variables
    let particles: THREE.Points;
    let Pgeometry: THREE.Geometry;
    let particlesMat: THREE.PointsMaterial;
    let cubes = [];
    let matLite: THREE.MeshBasicMaterial;
    let text: THREE.Mesh;

    const messages = ["1. Memories", "2. souvenirs", "3. test\nLorem ipsum dolor sit amet,\n consectetur adipiscing elit,\n sed do eiusmod tempor incididunt ut labore."]
    let messageIndex = 0;

    this.init = function() {
        initThreeJs();
        initGui();
        setupScene();

        scope.connect(); // add listeners
        scope.animate(); // start animation loop
    }

    const initThreeJs = function() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 0;

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    const initGui = function() {
        const settingsFolder = gui.addFolder('Settings');
        settingsFolder.add(options, 'particlesCount', 10, options.maxParticles, 1).listen();
        settingsFolder.add(options, 'animate').listen();
        settingsFolder.add(options, 'speed', 0.1, 3).listen();
        settingsFolder.open();
    }

    const setupScene = function() {
        // const controls: OrbitControls  = new OrbitControls(camera, renderer.domElement);
        controls = new ViewControls(camera, renderer.domElement);
 
        /*
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry();
        geometry.translate(0, 0, 30);
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
        scene.add(cube);
        */

        const size = 1;
        var boxGeom = new THREE.BoxBufferGeometry(size, size, size, 5, 5, 5);

        // this is the shortened part from the official example to create the sphere morph targets
        var pos = boxGeom.attributes.position;
        boxGeom.morphAttributes.position = [];
        var spherePositions = [];
        var v3 = new THREE.Vector3();
        for (var i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i).setLength((size/2 * Math.sqrt(3) + size/2) * 0.5);
            spherePositions.push(v3.x, v3.y, v3.z);
        }
        boxGeom.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

        var boxMat = new THREE.MeshBasicMaterial({ color: "aqua", wireframe: true, morphTargets: true });

        cubes = [];
        for (let i = -2; i <= 2; i++) {
            let cubeGeo: THREE.BoxBufferGeometry = new THREE.BoxBufferGeometry(size, size, size, 5, 5, 5);
            
            var pos = cubeGeo.attributes.position;
            cubeGeo.morphAttributes.position = [];
            var spherePositions = [];
            var v3 = new THREE.Vector3();
            for (var j = 0; j < pos.count; j++) {
                v3.fromBufferAttribute(pos, j).setLength((size/2 * Math.sqrt(3) + size/2) * 0.5);
                spherePositions.push(v3.x, v3.y, v3.z);
            }
            cubeGeo.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);
            const cube = new THREE.Mesh(cubeGeo, boxMat);

            cube.userData.isHovering = false;
            cube.userData.currentAction = null;
            cube.userData.toSphere = () => { action(cube, 1); }
            cube.userData.toBox = () => { action(cube, 0); }
            cube.position.set(i*8, 0, Math.sqrt(92*92-Math.pow(i*8, 2)));
            cubes.push(cube);
        }

        cubes.forEach(c => scene.add(c));

        // particles
        Pgeometry = new THREE.Geometry();

        const boxSize = new THREE.Vector3(200, 200, 200);
        for (let i = 0; i < options.particlesCount; i++) {
            const rand: THREE.Vector3 = new Vector3(Math.random(), Math.random(), Math.random());
            const vertex: THREE.Vector3 = rand.multiplyScalar(2).subScalar(1).multiply(boxSize);
            Pgeometry.vertices.push(vertex);
        }
        particlesMat = new THREE.PointsMaterial({ color: 0x0011ff, size: 0.1 });
        particles = new THREE.Points(Pgeometry, particlesMat);

        // particles.geometry.dynamic = true;
        particles.rotation.setFromVector3(particles.rotation.toVector3().random().multiplyScalar(2));

        scene.add(particles);

        text = generateText(messages[messageIndex]);
        scene.add(text);

        /*
        const font = new THREE.Font(HelvetikerFont);
        const color = 0x006699;
        const matDark = new THREE.LineBasicMaterial( { color: color, side: THREE.DoubleSide } );
        matLite = new THREE.MeshBasicMaterial( { color: color, transparent: true, opacity: 1, side: THREE.DoubleSide } );
        matLite.userData.targetOpacity = 1;
        matLite.userData.currentAction = null;
        const message = "Memories";
        const shapes = font.generateShapes( message, 2 );
        
        const geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        // make shape ( N.B. edge view not visible )
        text = new THREE.Mesh( geometry, matLite );
        text.position.set(0, 20, 80);
        scene.add(text);
        */

        // make line shape ( N.B. edge view remains visible )
        // const holeShapes = [];

        // shapes.forEach(shape => {
        //     if ( shape.holes && shape.holes.length > 0 ) {
        //         shape.holes.forEach(hole => { holeShapes.push( hole ); });
        //     }
        // });

        // shapes.push.apply( shapes, holeShapes );
        // const lineText = new THREE.Object3D();

        // shapes.forEach(shape => {
        //     const points = shape.getPoints();
        //     const geometry = new THREE.BufferGeometry().setFromPoints( points );
        //     geometry.translate( xMid, 0, 0 );
        //     const lineMesh = new THREE.Line( geometry, matDark );
        //     lineText.add( lineMesh );
        // });

        // scene.add( lineText );

    }

    // tweening function
    function action(cube, influence) {
        if (cube.userData.currentAction) cube.userData.currentAction.stop();
        
        cube.userData.currentAction = new TWEEN.Tween(cube.morphTargetInfluences).to({
            "0": influence
        }, 1000).start();
    
    }

    const updateMesh = function() {
        //------------Update Text  Mesh----------
        //remove old mesh
        scene.remove(text);
        //add new mesh

        text = generateText(messages[messageIndex]);
        scene.add(text);
    }

    const generateText = function(message) {
        const font = new THREE.Font(HelvetikerFont);
        const color = 0x006699;
        const matDark = new THREE.LineBasicMaterial( { color: color, side: THREE.DoubleSide } );
        
        matLite = new THREE.MeshBasicMaterial( { color: color, transparent: true, opacity: matLite ? matLite.userData.targetOpacity : 1, side: THREE.DoubleSide } );
        matLite.userData.targetOpacity = 1;
        matLite.userData.currentAction = null;

        const shapes = font.generateShapes( message, 1 );
        
        const geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        // make shape ( N.B. edge view not visible )
        const text = new THREE.Mesh( geometry, matLite );
        text.position.set(0, 10, 80);

        return text;
    }
    
    const updateParticleCount = () => {
        if(Pgeometry.vertices.length != options.particlesCount) {

            scene.remove(particles);

            Pgeometry = new THREE.Geometry();
            const boxSize = new THREE.Vector3(200, 200, 200);
            
            for (let i = 0; i < options.particlesCount; i++) {
                const rand: THREE.Vector3 = new Vector3(Math.random(), Math.random(), Math.random());
                const vertex: THREE.Vector3 = rand.multiplyScalar(2).subScalar(1).multiply(boxSize);
                Pgeometry.vertices.push(vertex);
            }

            // if(Pgeometry.vertices.length > options.particlesCount) {
            //     Pgeometry.vertices = Pgeometry.vertices.slice(0, options.particlesCount);
            
            // }else {
            //     for (let i = 0; i < options.particlesCount - Pgeometry.vertices.length; i++) {
            //         const vertex = new THREE.Vector3();
            //         vertex.x = Math.random() * 10 - 5;
            //         vertex.y = Math.random() * 10 - 5;
            //         vertex.z = Math.random() * 10 - 5;
            //         Pgeometry.vertices.push(vertex);
            //     }
            // }

            // Pgeometry.vertices.forEach( v => {
            //     v.x = Math.random() * 10 - 5;
            //     v.y = Math.random() * 10 - 5;
            //     v.z = Math.random() * 10 - 5;
            // });

            particles = new THREE.Points(Pgeometry, particlesMat);
            scene.add(particles);

        }
    }

    this.animate = function {
        requestAnimationFrame(scope.animate);
        var time = Date.now() * options.speed / 1000;

        if(options.animate) {
            // cube.rotation.x += 0.001;
            // cube.rotation.y += 0.001;

            const h = (360 * time % 360) / 360;
            particlesMat.color.setHSL(h, 1., 0.8);

            Pgeometry.rotateY(0.0002);
            Pgeometry.rotateZ(0.0002);
        }
        updateParticleCount();
        controls.update();

        render();

    };

    const render = function() {
        TWEEN.update();
        renderer.render(scene, camera);
    }

    this.connect = function () {
		window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
	};

	this.disconnect = function () {
		window.removeEventListener('resize', onWindowResize, false);
        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('touchstart', onDocumentTouchStart, false);
        document.removeEventListener('touchmove', onDocumentTouchMove, false);
        document.removeEventListener( 'keydown', onKeyDown, false );
        document.removeEventListener( 'keyup', onKeyUp, false );
    };
    
    // events handlers

    const onWindowResize = function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }
    
    const onDocumentMouseMove = function(e) {
        mouse.set(e.clientX, e.clientY); // update mouse
        
        // intersects = raycaster.intersectObject(cube);
        const intersects = raycaster.intersectObjects(cubes);
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

        if (intersects.length > 0) {
            // console.log(intersects);
        }

        intersects.forEach(inter => {
            if (!inter.object.userData.isHovering) {
                inter.object.userData.toSphere();
                inter.object.userData.isHovering = true;
            } else {
                inter.object.userData.toBox();
                inter.object.userData.isHovering = false;
            }
        });

    }

    const onDocumentTouchStart = function(evt) {
        if (evt.touches.length === 1) {
            evt.preventDefault();
            mouse.set(evt.touches[0].pageX, evt.touches[0].pageY);
        }
    }

    const onDocumentTouchMove = function(evt) {
        if (evt.touches.length === 1) {
            evt.preventDefault();
            mouse.set(evt.touches[0].pageX, evt.touches[0].pageY);
        }
    }

    const onKeyDown = function(evt) {
        switch ( evt.keyCode ) {
            case 76: // l        
                controls.enabled ? controls.unlock() : controls.lock();
                break;
            case 83: // s

                matLite.userData.targetOpacity = 1-matLite.userData.targetOpacity;

                if (matLite.userData.currentAction) matLite.userData.currentAction.stop();

                matLite.userData.currentAction = new TWEEN.Tween(matLite).to({
                    "opacity": matLite.userData.targetOpacity
                }, 1000).start();
                break;
            case 78: // n
                messageIndex = (messageIndex+1) % messages.length;
                updateMesh();

                break;
            default: 
                // console.log(`unknown ${event.keyCode}`);    
        }
    }

    const onKeyUp = function(evt) {
        // do nothing
    }

};
App.prototype.constructor = App;

window.onload = function() {

    const app = new App();
    console.log(app);
    
    app.init(); 
};