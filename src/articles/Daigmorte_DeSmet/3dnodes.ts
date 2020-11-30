import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import* as TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';

const App = function () {

    let scope = this;

    // Global variables
    const scene: THREE.Scene = new THREE.Scene();
    let rendererCss: CSS3DRenderer;
    let camera: THREE.PerspectiveCamera;

    let enableRotation = true;

    this.history = [];

    let mouse: THREE.Vector2 = new THREE.Vector2();

    const arrowBack = document.createElement('div');

    // Scene variables
    let cssContainer: THREE.Object3D;

    let cssBlockPosition = new THREE.Vector3(0, 0, -50);
    let scroolMomentum = 0;
    let scroolOffset = 0;
    let maxScroolOffset = 300;
    let currentSectionId = undefined;

    this.initThreeJs = function() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 1000);
        camera.position.z = 10;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        // renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.setClearColor( 0x000000, 1 );
        // renderer.setPixelRatio( window.devicePixelRatio );
        // document.getElementById('canvas').appendChild(renderer.domElement);

        rendererCss = new CSS3DRenderer();
        rendererCss.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvasCss').appendChild(rendererCss.domElement);
    }

    // this.initGui = function() {
    //     const settingsFolder = gui.addFolder('Settings');
    //     settingsFolder.add(options, 'particlesCount', 10, options.maxParticles, 1).listen();
    //     settingsFolder.add(options, 'animate').listen();
    //     settingsFolder.add(options, 'speed', 0.1, 3).listen();
    //     settingsFolder.open();
    // }
    this.initOthers = function() {
        arrowBack.classList.add('sectionBackArrow', 'fas', 'fa-arrow-left');
        arrowBack.onclick = function() {goBack()};
    }

    const getNodeinfos = function(node) {
        const clone = node.cloneNode(true)
        clone.style.cssText = "position:fixed; top:-9999px; opacity:0;"
        document.body.appendChild(clone)
        const infos = clone.getBoundingClientRect()
        clone.parentNode.removeChild(clone)
        return infos
    }

    this.loadSection = function (sectionId) {
        const source = document.getElementById(sectionId);
        
        if(source) {
            const element = source.cloneNode(true);
            currentSectionId = element.id;
            element.id = element.id+'Current';
            element.style.width = '65%';
            element.style.opacity = 0.0;
            element.appendChild(arrowBack);

            const elementInfos = getNodeinfos(element);

            scroolOffset = 0;
            if(elementInfos.height > window.innerHeight) {
                maxScroolOffset = (elementInfos.height-window.innerHeight)/2/(elementInfos.height/window.innerHeight);
                cssBlockPosition.y = -(elementInfos.height-window.innerHeight)/6/(elementInfos.height/window.innerHeight);
            }else {
                maxScroolOffset = 0;
                cssBlockPosition.y = 0;
            }

            const css3dObject = new CSS3DObject(element);
            if(cssContainer.css3dObject)
                cssContainer.remove(cssContainer.css3dObject)
            cssContainer.css3dObject = css3dObject;
            cssContainer.add(css3dObject);

            if (cssContainer.currentAction) cssContainer.currentAction.stop();
            cssContainer.currentAction = fadeOpacity(1.0).start();
            
            // console.log(document.getElementById(currentSectionId+'Current').getBoundingClientRect());
        }else {
            console.log(`unknow section : ${sectionId}`);
        }
    }

    const fadeOpacity = (opacity, delay = 700) => new TWEEN.Tween(cssContainer.css3dObject.element.style).easing(TWEEN.Easing.Cubic.InOut).to({"opacity": opacity}, delay);

    this.changeSection = function(sectionId) {
        scope.history.push(currentSectionId);
        
        if (cssContainer.currentAction) cssContainer.currentAction.stop();
        cssContainer.currentAction = fadeOpacity(0.0).onComplete(() => { 
            scope.loadSection(sectionId);
        }).start();
    }

    this.setupScene = function() {

        cssContainer = new THREE.Object3D();

        scope.loadSection('section01');
        
        cssContainer.scale.multiplyScalar(0.12);

        scene.add(cssContainer);
    }

    const goBack = function() {
        console.log('history:', scope.history);
        
        if(scope.history.length) {
            if (cssContainer.currentAction) cssContainer.currentAction.stop();
            cssContainer.currentAction = fadeOpacity(0.0).onComplete(() => { 
                scope.loadSection(scope.history[scope.history.length-1]);
                scope.history.pop();
            }).start();
            
        } else {
            window.location.href = 'index.html';
        }
    }

    const updateCssPos = () => {
        cssContainer.position.copy(cssBlockPosition);
        cssContainer.position.y += scroolOffset;
    }

    const updateDOMRotation = () => {
        const windowsSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
        let nmc = new THREE.Vector2().copy(mouse).divide(windowsSize).multiplyScalar(2).subScalar(1); // normalized mouse coord
        nmc.y *= -1; // flip y axis
        nmc.multiplyScalar(5.0); // increase effect
        cssContainer.lookAt(nmc.x, nmc.y + cssContainer.position.y, 0.5);
    }

    this.animate = function {
        // const time = Date.now() * options.speed / 1000;

        // scrool update
        scroolOffset += scroolMomentum * 0.05;
        scroolOffset = Math.min(Math.max(0, scroolOffset), maxScroolOffset);
        updateCssPos()
        scroolMomentum *= 0.9;

        TWEEN.update();
        // console.log(cssContainer.css3dObject.element.style.opacity);
        render();
        requestAnimationFrame(scope.animate);
    };

    const render = function() {
        // renderer.render(scene, camera);
        rendererCss.render( scene, camera );
    }

    // events handlers
    const onWindowResize = function() {
        const h = window.innerHeight
        const w = window.innerWidth;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        // renderer.setSize(w, h);
        rendererCss.setSize(w, h);
        // postprocessing.composer.setSize(w, h);
        // render();       
    }
    
    const onDocumentMouseDown  = function(e) {
        mouse.set(e.clientX, e.clientY); // update mouse
    }

    const onDocumentMouseMove = function(e) {
        mouse.set(e.clientX, e.clientY); // update mouse
        
        if(enableRotation) {
            updateDOMRotation();
        }
    }
    const onWheel = function(e) {
        // if (e.wheelDelta) {
        //     return e.wheelDelta > 0;
        // }
        scroolMomentum -= e.wheelDelta/10;
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
                // switchText();
                break;
            default: 
                // console.log(`unknown ${event.keyCode}`);    
        }
    }

    const onKeyUp = function(evt) {
        // do nothing
    }

    this.connect = function () {        
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener("wheel", onWheel, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false );
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
	};

	this.disconnect = function () {
        window.removeEventListener('resize', onWindowResize, false);
        window.removeEventListener("wheel", onWheel, false);
        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mousedown', onDocumentMouseDown, false );
        document.removeEventListener('touchstart', onDocumentTouchStart, false);
        document.removeEventListener('touchmove', onDocumentTouchMove, false);
        document.removeEventListener( 'keydown', onKeyDown, false );
        document.removeEventListener( 'keyup', onKeyUp, false );
    };

    this.init = function() {
        scope.initThreeJs();
        // scope.initGui();
        scope.initOthers();
        scope.setupScene();

        scope.connect(); // add listeners
        scope.animate(); // start animation loop
    }()

};

window.addEventListener("load", function() {
    app = new App();
});

