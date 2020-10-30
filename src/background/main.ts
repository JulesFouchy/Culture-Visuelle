import p5 from 'p5'
import vs from './myShader.vert'
import fs from './myShader.frag'

const createBG = () => new p5((p: p5) => {
    
    let myShader: p5.Shader

    p.myScale = 1
    p.translationX = 0 // in pixels
    p.translationY = 0 // in pixels
    p.nodesX1 = [0.1, 0.3]
    p.nodesY1 = [0.2, 0.4]
    p.nodesX2 = [0.3, 0.1]
    p.nodesY2 = [0.4, 0.6]
    
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
        myShader = p.createShader(vs, fs)
    }

    p.draw = function() {
        // Restore usual p5 coordinates
        p.translate(-p.width/2, -p.height/2)
        // Apply shader
        p.noStroke()
        p.shader(myShader)
        myShader.setUniform("uAspectRatio", p.width / p.height)
        myShader.setUniform("x1", p.nodesX1)
        myShader.setUniform("y1", p.nodesY1)
        myShader.setUniform("x2", p.nodesX2)
        myShader.setUniform("y2", p.nodesY2)
        myShader.setUniform("scale", p.myScale)
        myShader.setUniform("translation", [p.translationX / p.height, p.translationY / p.height])
        p.rect(0, 0, p.width, p.height)
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
})

export default createBG