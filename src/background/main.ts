import p5 from 'p5'
import vs from './myShader.vert'
import fs from './myShader.frag'

const initBG = () => new p5((p: p5) => {
    
    let myShader: p5.Shader
    
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
        p.rect(0, 0, p.width, p.height)
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
})

export default initBG