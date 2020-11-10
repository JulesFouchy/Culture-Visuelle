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
    p.edgesLists
    p.timeOfHover = 0
    p.animatingBackward = false
    p.hoveredIdx = null
    let nextHoveredIdx = null

    p.setGraph = function (verticesList, edgesList) {
        // Positions of all the edges
        edgesList.forEach(pair => {
            p.nodesX1.push(verticesList[pair[0]].x)
            p.nodesY1.push(verticesList[pair[0]].y)
            p.nodesX2.push(verticesList[pair[1]].x)
            p.nodesY2.push(verticesList[pair[1]].y)
        })
        // Lists of edges starting from a given vertex
        p.edgesLists = new Array(verticesList.length)
        for (let i = 0;i < p.edgesLists.length; ++i)
            p.edgesLists[i] = new Array()
        edgesList.forEach((pair, i) => {
            p.edgesLists[pair[0]].push({idx: i, dir:  1})
            p.edgesLists[pair[1]].push({idx: i, dir: -1})
        })
    }

    p.onHoverStart = function(idx: number) {
        if (p.hoveredIdx === null) {
            p.animatingBackward = false
            p.timeOfHover = (new Date()).getTime() / 1000
            p.hoveredIdx = idx
        }
        else if (
            (nextHoveredIdx === null && idx !== p.hoveredIdx) ||
            (nextHoveredIdx !== null && idx !== nextHoveredIdx))
            {
                nextHoveredIdx = idx
            }
    }

    p.onHoverEnd = function() {
        if (p.hoveredIdx !== null && !p.animatingBackward) {
            p.animatingBackward = true
            p.timeOfHover = (new Date()).getTime() / 1000
        }
        nextHoveredIdx = null
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
            // Progress
            const t = 2 * ((new Date()).getTime() / 1000 - p.timeOfHover)
            if (!p.animatingBackward) {
                myShader.setUniform("progress", p.min(t, 1))
            }
            else {
                if (t < 1) {
                    myShader.setUniform("progress", 1-t)
                }
                else {
                    if (nextHoveredIdx !== null) {
                        p.hoveredIdx = nextHoveredIdx
                        nextHoveredIdx = null
                        p.animatingBackward = false
                        p.timeOfHover = (new Date()).getTime() / 1000
                    }
                    else {
                        p.hoveredIdx = null
                    }
                    myShader.setUniform("progress", 0)
                }
            }
            // Show or not
            if (p.hoveredIdx !== null) {
                let showEdges = new Array(p.nodesX1.length).fill(0)
                p.edgesLists[p.hoveredIdx].forEach(edge => {
                    showEdges[edge.idx] = edge.dir
                })
                myShader.setUniform("showEdges", showEdges)
            }
        }
        p.rect(0, 0, p.width, p.height)
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
})

export default createBG