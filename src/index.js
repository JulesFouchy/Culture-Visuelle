import { Scene, PerspectiveCamera, WebGLRenderer, Color,Geometry,Vector3,TextureLoader,PointsMaterial,Points } from 'three'
  
let scene, camera, renderer, starGeo, star, stars, sprite, starMaterial;

function init() {
    window.addEventListener('resize', function() {
      onResize();
    });
    scene = new Scene()
    camera = new PerspectiveCamera( 760, window.innerWidth / window.innerHeight, 1, 1000 )
    camera.position.z=1;
    camera.rotation.x=Math.PI/2;
    renderer = new WebGLRenderer()
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.domElement.id = 'canvas-bg';

    document.body.appendChild( renderer.domElement )
    
    starGeo = new Geometry();
      for(let i=0; i<6000;i++){
        star = new Vector3(Math.random()*600-300,Math.random()*600-300,Math.random()*600-300)
        star.velocity = 0
        star.acceleration = 0.002
        starGeo.vertices.push(star)
    }
    
    sprite = new TextureLoader().load('https://raw.githubusercontent.com/JulesFouchy/Culture-Visuelle/master/src/assets/circle.png')
    starMaterial = new PointsMaterial({
      color : 0xaaaaaa,
      size : 0.7,
      map : sprite
    })
    
    stars = new Points(starGeo, starMaterial)
    scene.add(stars)
    animate()
}
  
 
  
 function animate() {
    
    starGeo.vertices.forEach(p=>{
      p.velocity += p.acceleration;
      p.y -= p.velocity
      if(p.y <-200){
        p.y=200;
        p.velocity=0
      }
    })
    starGeo.verticesNeedUpdate = true;
    stars.rotation.y +=  0.002;

   renderer.render( scene, camera );
   requestAnimationFrame( animate );
}

function onResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
}


init();

