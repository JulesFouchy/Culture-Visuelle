import * as THREE from 'three';

// helpers
const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const range = ( x1: number, y1: number, x2: number, y2: number, a: number) => lerp(x2, y2, invlerp(x1, y1, a));

const ViewControls = function ( object, domElement ) {

	if ( domElement === undefined ) console.warn( 'THREE.viewControls: The second parameter "domElement" is now mandatory.' );
	if ( domElement === document ) console.error( 'THREE.viewControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

	this.object = object;
	this.domElement = domElement;

	this.enabled = false; // Set to false to disable this control
	
	let scope = this;
	// internals
	const target = new THREE.Vector3(0, 0, 0); // "target" sets the location of focus, where the object orbits around

	const minDistance = 100;
	const maxDistance = 110;
	const dollyStepsCount = 2;
	let currentStep = 0;
	const dollyDeltaStep = (maxDistance-minDistance)/(dollyStepsCount-1);

	const AzimuthAmp = Math.PI/4; //radians
	const minAzimuthAngle = -AzimuthAmp/2; // radians
	const maxAzimuthAngle = AzimuthAmp/2; // radians
	const AzimuthSpeed = 0.0006;

	const polarAmp = Math.PI/7;
	const minPolarAngle = Math.PI/2 - polarAmp/2; // radians
	const maxPolarAngle = Math.PI/2 + polarAmp/2; // radians
	const PolarSpeed = 0.001;

	// Position in spherical coordinates
	let movement = new THREE.Vector2();

	let spherical = new THREE.Spherical(minDistance, Math.PI/2, 0);
	// let targetSpherical = new THREE.Spherical(minDistance, Math.PI/2, 0);

	let panOffset = new THREE.Vector3();
	// let zoomChanged = false;

	let rotateStart = new THREE.Vector2();
	let rotateEnd = new THREE.Vector2();
	let rotateDelta = new THREE.Vector2();

	// let panStart = new THREE.Vector2();
	// let panEnd = new THREE.Vector2();
	// let panDelta = new THREE.Vector2();

	// public methods

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function () {
		let offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		const quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		const quatInverse = quat.clone().inverse();
	
		const twoPI = 2 * Math.PI;

		return function update() {
			let position = scope.object.position;

			offset.copy(position).sub(target);

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion(quat);

			// angle from z-axis around y-axis
			spherical.setFromVector3(offset);

			// TODO slow down on extremity using distance
			spherical.theta += movement.x * AzimuthSpeed;
			spherical.phi += movement.y * PolarSpeed;

			movement.divideScalar(1.5);
			// restrict theta to be between desired limits
			var min = minAzimuthAngle;
			var max = maxAzimuthAngle;
			
			if ( isFinite( min ) && isFinite( max ) ) {
				if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;
				if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;
				if ( min < max ) {
					spherical.theta =  clamp(spherical.theta, min, max);
				} else {
					spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ? Math.max( min, spherical.theta ) : Math.min( max, spherical.theta );
				}
			}

			// restrict to be between desired limits
			// spherical.theta = clamp(spherical.theta, minAzimuthAngle, maxAzimuthAngle);
			spherical.phi = clamp(spherical.phi, minPolarAngle, maxPolarAngle);

			// spherical.phi = clamp(spherical.phi, minPolarAngle, maxPolarAngle);
			spherical.makeSafe();
			
			spherical.radius = minDistance + currentStep * dollyDeltaStep;
			spherical.radius = clamp(spherical.radius, minDistance, maxDistance);
			
			offset.setFromSpherical(spherical);

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion(quatInverse);

			position.copy(target).add(offset);

			scope.object.lookAt(target);

			return true;
		};

	}();

	this.lock = function () {
		this.domElement.requestPointerLock();
		// console.log("lock");
		this.enabled = true;
	};

	this.unlock = function () {
		this.domElement.ownerDocument.exitPointerLock();
		// console.log("unlock");
		this.enabled = false;
	};

	this.connect = function () {
		scope.domElement.ownerDocument.addEventListener( 'mousewheel', onMouseWheel, { passive: false } );
		scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError, false );
	};

	this.disconnect = function () {
		scope.domElement.ownerDocument.removeEventListener( 'mousewheel', onMouseWheel, { passive: false } );
		scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError, false );
	};

	this.dispose = function () { this.disconnect(); };

	// private methods

	const onPointerlockChange = function() {
		if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {
			// scope.dispatchEvent( lockEvent );
			scope.enabled = true;
		} else {
			// scope.dispatchEvent( unlockEvent );
			scope.enabled = false;
		}
	}

	const onPointerlockError = function() { console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' ); }

	const dollyOut = function() { currentStep = clamp(currentStep+1, 0, dollyStepsCount-1); }

	const dollyIn = function() { currentStep = clamp(currentStep-1, 0, dollyStepsCount-1); }

	// event callbacks
	const onMouseMove = function(event) {
		
		if ( scope.enabled === false ) return;
		event.preventDefault();

		movement.set(event.movementX || event.mozMovementX || event.webkitMovementX || 0, event.movementY || event.mozMovementY || event.webkitMovementY || 0);

		scope.update();
	}

	const  onMouseWheel = function(event) {
		if ( scope.enabled === false) return;
		event.preventDefault();
		event.stopPropagation();

		handleMouseWheel(event);
		scope.update();
	}

	const handleMouseWheel = function(event) {
		// console.log(event.deltaX, ", ", event.deltaY);
		
		if ( event.deltaY < 0 ) {
			dollyIn();
		} else if ( event.deltaY > 0 ) {
			dollyOut();
		}
	}

	this.connect();
	// force an update at start
	this.update();
};

ViewControls.prototype = Object.create( THREE.EventDispatcher.prototype );
ViewControls.prototype.constructor = ViewControls;

export { ViewControls };