import {Scene, PerspectiveCamera, WebGLRenderer,Geometry,Vector3,PointsMaterial,Points } from 'three'

const StartBackground = function(wrapperId) {
  let scope = this;

  let scene, camera, renderer, starGeo, star, stars, starMaterial;

  this.animate = function() {
    starGeo.vertices.forEach(p=>{
      p.velocity += p.acceleration;
      p.y -= p.velocity
      if(p.y <-200){
        p.y=200;
        p.velocity=0
      }
    })
    starGeo.verticesNeedUpdate = true;
    stars.rotation.y +=  0.001;

   renderer.render( scene, camera );
   requestAnimationFrame( scope.animate );
  }
  
  this.init = function() {
    window.addEventListener('resize', onResize);

    scene = new Scene()
    camera = new PerspectiveCamera(760, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.z=1;
    camera.rotation.x=Math.PI/2;

    renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    document.getElementById(wrapperId).appendChild(renderer.domElement)

    starGeo = new Geometry();
      for(let i=0; i<6000;i++){
        star = new Vector3(Math.random()*600-300,Math.random()*600-300,Math.random()*600-300)
        star.velocity = 0
        star.acceleration = 0.0005
        starGeo.vertices.push(star)
    }
    
    starMaterial = new PointsMaterial({
      color : 0xaaaaaa,
      size : 0.7,
    })
    
    stars = new Points(starGeo, starMaterial)
    scene.add(stars)
    scope.animate()
  }()

  const onResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )    
  }

}

window.addEventListener("load", function(){
  const startBackground = new StartBackground('startBackground');
});

