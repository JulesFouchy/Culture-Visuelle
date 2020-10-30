import p5 from 'p5'
import vs from './myShader.vert'
import fs from './myShader.frag'

const createBG = () => new p5((p: p5) => {
    
    let myShader: p5.Shader

    p.myScale = 1
    p.translationX = 0 // in pixels
    p.translationY = 0 // in pixels
    
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
        myShader.setUniform("x1", 0)
        myShader.setUniform("y1", 0)
        myShader.setUniform("x2", 0.5 * p.width / p.height)
        myShader.setUniform("y2", 0.5)
        myShader.setUniform("scale", p.myScale)
        myShader.setUniform("translation", [p.translationX / p.height, p.translationY / p.height])
        p.rect(0, 0, p.width, p.height)
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
})

export default createBG