import p5 from 'p5'
import vs from './myShader.vert'
import fs from './myShader.frag'

const createBG = () => new p5((p: p5) => {
    
    let myShader: p5.Shader

    p.myScale = 1.1663507799970827
    p.translationX = 240.71507332764804 // in pixels
    p.translationY = 264.15263021428393 // in pixels
    p.nodesX1 = []
    p.nodesY1 = []
    p.nodesX2 = []
    p.nodesY2 = []
    p.timeOfHover = 0
    p.hoveredIdx = null

    p.onHoverStart = function(idx: number) {
        if (p.hoveredIdx === null) {
            p.timeOfHover = (new Date()).getTime() / 1000
            p.hoveredIdx = idx
        }
    }

    p.onHoverEnd = function() {
        p.hoveredIdx = null
    }
    
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
        myShader.setUniform("x1", p.nodesX1.map(x => x * p.width / p.height))
        myShader.setUniform("y1", p.nodesY1)
        myShader.setUniform("x2", p.nodesX2.map(x => x * p.width / p.height))
        myShader.setUniform("y2", p.nodesY2)
        myShader.setUniform("scale", p.myScale)
        myShader.setUniform("translation", [p.translationX / p.height, p.translationY / p.height])
        if (p.hoveredIdx !== null) {
            const time = (new Date()).getTime() / 1000 - p.timeOfHover
            myShader.setUniform("progress", p.min(time, 1))
        }
        else {
            myShader.setUniform("progress", 0)
        }
        p.rect(0, 0, p.width, p.height)
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
})

export default createBG