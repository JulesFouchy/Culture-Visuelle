import * as THREE from 'three';
import* as TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';
 
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// import { ViewControls }  from './ViewControls.ts';

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

const App = function () {

    const scope = this;

    // Global variables
    const scene: THREE.Scene = new THREE.Scene();
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    let camera: THREE.PerspectiveCamera;

    // const postprocessing = {};

    let enableRotation = true;

    const gui = new dat.GUI();
    // Options to be added to the GUI
    const options = {
        particlesCount: 1000,
        maxParticles: 10000,
        animate: true,
        speed: 0.5,
        // dof: {
        //     focus: 500.0,
        //     aperture: 5,
        //     maxblur: 0.01
        // },
    };

    let mouse: THREE.Vector2 = new THREE.Vector2();

    // Scene variables
    let particles: THREE.Points;
    let particlesGeom: THREE.Geometry;
    let particlesMat: THREE.PointsMaterial;

    let textsMat: THREE.MeshBasicMaterial;
    const textFont: THREE.Font = new THREE.Font(HelvetikerFont);
    const selectedTextColor = 0xeeeeee;
    const backTextOpacity = 0.15;
    const textSize = 0.5;
    // const boundingBoxTextsSpawn = new THREE.Vector3(10, 10, 10);
    let boundingBoxTextsSpawn: THREE.Box3;

    const textPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    let texts: THREE.Mesh[];


    const messages = [
        "1. Memories\ntest", 
        "2. souvenirs", 
        "3. test\nLorem ipsum dolor sit amet,\n consectetur adipiscing elit,\n sed do eiusmod tempor incididunt ut labore.",
    ];

    for (let i = 0; i < 50; i++) {
        messages.push('lorem ipsum');
    }

    let currentMsgId = 0;

    this.init = function() {
        initThreeJs();
        initGui();
        initOthers();
        setupScene();
        // initPostprocessing();

        scope.connect(); // add listeners
        scope.animate(); // start animation loop
    }

    const initThreeJs = function() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
        camera.lookAt(textPosition);

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    const initGui = function() {
        const settingsFolder = gui.addFolder('Settings');
        settingsFolder.add(options, 'particlesCount', 10, options.maxParticles, 1).listen();
        settingsFolder.add(options, 'animate').listen();
        settingsFolder.add(options, 'speed', 0.1, 3).listen();
        // const dofFolder = gui.addFolder('Depth Of field');
        // dofFolder.add( options.dof, "focus", 1.0, 3000.0, 10 ).onChange( updateDof );
        // dofFolder.add( options.dof, "aperture", 0, 10, 0.1 ).onChange( updateDof );
        // dofFolder.add( options.dof, "maxblur", 0.0, 0.01, 0.001 ).onChange( updateDof );

        settingsFolder.open();
    }

    const initOthers = function() {
        textsMat = new THREE.MeshBasicMaterial( { color: selectedTextColor, transparent: true, opacity: 1, side: THREE.DoubleSide } );
        // textsMat.userData.targetOpacity = 1;
        textsMat.userData.currentAction = null;

        boundingBoxTextsSpawn = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(80, 80, 20));

        // center around zero
        let boxCenter: THREE.Vector3 = boundingBoxTextsSpawn.getCenter();
        boundingBoxTextsSpawn.translate(boxCenter.multiplyScalar(-1));

        boundingBoxTextsSpawn.translate(new THREE.Vector3(0, 0, -30));
    }

    // const initPostprocessing = function() {

    //     const renderPass = new RenderPass( scene, camera );
    //     const bokehPass = new BokehPass( scene, camera, {
    //         focus: 1.0,
    //         aperture: 0.025,
    //         maxblur: 0.01,

    //         width: window.innerWidth,
    //         height: window.innerHeight
    //     } );

    //     const composer = new EffectComposer( renderer );
    //     composer.addPass( renderPass );
    //     composer.addPass( bokehPass );

    //     postprocessing.composer = composer;
    //     postprocessing.bokeh = bokehPass;
    // }

    const setupScene = function() {

        // particles
        particlesGeom = new THREE.Geometry();

        const boxSize = new THREE.Vector3(200, 200, 200);
        for (let i = 0; i < options.particlesCount; i++) {
            const rand: THREE.Vector3 = new THREE.Vector3(Math.random(), Math.random(), Math.random());
            const vertex: THREE.Vector3 = rand.multiplyScalar(2).subScalar(1).multiply(boxSize);
            particlesGeom.vertices.push(vertex);
        }
        particlesMat = new THREE.PointsMaterial({ color: 0x0011ff, size: 0.1 });
        particles = new THREE.Points(particlesGeom, particlesMat);

        // particles.geometry.dynamic = true;
        particles.rotation.setFromVector3(particles.rotation.toVector3().random().multiplyScalar(2));

        scene.add(particles);

        // texts
        texts = messages.map((m , id) => generateText(m, id))
        
        texts.forEach(t => scene.add(t));

    }

    const generateText = function(message, index) {

        const textMat = new THREE.MeshBasicMaterial().copy(textsMat);
        if( index != currentMsgId) { textMat.opacity = backTextOpacity; }

        const shapes: THREE.Shape[] = textFont.generateShapes(message, textSize);
        const geometry: THREE.ShapeBufferGeometry = new THREE.ShapeBufferGeometry(shapes);

        // center text
        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox;
        const size = bbox.max.sub(bbox.min);
        geometry.translate(-0.5*size.x, -textSize+0.5*size.y, 0);

        const text = new THREE.Mesh(geometry, textMat);
        
        if( index == currentMsgId) {
            text.position.add(textPosition);
        }else {
            let boxSize: THREE.Vector3 = boundingBoxTextsSpawn.getSize();
            const randomPosition: THREE.Vector3 = new THREE.Vector3().random().multiply(boxSize).add(boundingBoxTextsSpawn.min);
            text.position.add(randomPosition);
        }
        return text;
    }

    const switchText = function () {
        const newMsgId = (currentMsgId+1)%texts.length; 

        const fadeOpacity = (index, opacity) => new TWEEN.Tween(texts[index].material).to({"opacity": opacity}, 1000);
        const move = (index, pos) => new TWEEN.Tween(texts[index]).to({"position": pos}, 100);

        if (texts[currentMsgId].userData.currentAction) texts[currentMsgId].userData.currentAction.stop();
        if (texts[newMsgId].userData.currentAction) texts[newMsgId].userData.currentAction.stop();
   
        const currentPos = new THREE.Vector3().copy(texts[currentMsgId].position);
        const nextPos = new THREE.Vector3().copy(texts[newMsgId].position);
        
        // .onComplete(() => { texts[newMsgId].rotation.set(0, 0, 0); }))
        texts[newMsgId].userData.currentAction =
            fadeOpacity(newMsgId, 0)
            .chain(move(newMsgId, currentPos).onComplete(() => { texts[newMsgId].rotation.set(0, 0, 0);  })
            .chain(fadeOpacity(newMsgId, 1))).start();

        texts[currentMsgId].userData.currentAction =
            fadeOpacity(currentMsgId, 0) .onComplete(() => { enableRotation = false; })
            .chain(move(currentMsgId, nextPos).onComplete(() => { 
                texts[currentMsgId].rotation.set(0, 0, 0); 
                currentMsgId = newMsgId; 
                enableRotation = true; 
            })
            .chain(fadeOpacity(currentMsgId, backTextOpacity))).start();
        
            
    }

    // const updateDof = function ( ) {
    //     postprocessing.bokeh.uniforms[ "focus" ].value = options.dof.focus;
    //     postprocessing.bokeh.uniforms[ "aperture" ].value = options.dof.aperture * 0.00001;
    //     postprocessing.bokeh.uniforms[ "maxblur" ].value = options.dof.maxblur;
    // };

    const updateTextRotation = () => {
        
        const windowsSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
        let nmc = new THREE.Vector2().copy(mouse).divide(windowsSize).multiplyScalar(2).subScalar(1); // normalized mouse coord
        nmc.y *= -1; // flip y axis
        nmc.multiplyScalar(0.5); // reduce effect
        texts[currentMsgId].lookAt(nmc.x, nmc.y, 0.5);
    }

    const updateParticleCount = () => {
        if(particlesGeom.vertices.length != options.particlesCount) {

            scene.remove(particles);

            particlesGeom = new THREE.Geometry();
            const boxSize = new THREE.Vector3(200, 200, 200);
            
            for (let i = 0; i < options.particlesCount; i++) {
                const vertexPos: THREE.Vector3 = new THREE.Vector3().random().multiplyScalar(2).subScalar(1).multiply(boxSize);
                particlesGeom.vertices.push(vertexPos);
            }

            particles = new THREE.Points(particlesGeom, particlesMat);
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


            particlesGeom.rotateY(0.0002);
            particlesGeom.rotateZ(0.0002);
        }
        updateParticleCount();

        TWEEN.update();
        render();

    };

    const render = function() {
        renderer.render(scene, camera);
        // postprocessing.composer.render(0.1);
    }

    this.connect = function () {
		window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false );
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
	};

	this.disconnect = function () {
		window.removeEventListener('resize', onWindowResize, false);
        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mousedown', onDocumentMouseDown, false );
        document.removeEventListener('touchstart', onDocumentTouchStart, false);
        document.removeEventListener('touchmove', onDocumentTouchMove, false);
        document.removeEventListener( 'keydown', onKeyDown, false );
        document.removeEventListener( 'keyup', onKeyUp, false );
    };
    
    // events handlers

    const onWindowResize = function() {
        const h = window.innerHeight
        const w = window.innerWidth;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        // postprocessing.composer.setSize(w, h);
        // render();       
    }
    
    const onDocumentMouseDown  = function(e) {
        mouse.set(e.clientX, e.clientY); // update mouse
        
        
    }

    const onDocumentMouseMove = function(e) {
        mouse.set(e.clientX, e.clientY); // update mouse
        
        if(enableRotation)
            updateTextRotation();
        /*
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
        */
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
            case 83: // s
                switchText();
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