import p5 from 'p5'
import vs from './myShader.vert'
import fs from './myShader.frag'

import Point from '../components/Point'

const createBG = () => new p5((p: p5) => {
    
    let myShader: p5.Shader

    const edgeAnimSpeed = 4

    p.myScale = 0.6302494097246083
    p.translation = new Point(0, 0) // in pixels

    p.articlesList = []
    p.edgesList = []

    p.timeOfHover = 0
    p.animatingBackward = false
    p.hoveredIdx = null
    let nextHoveredIdx = null

    p.linkGraph = function (articlesList, edgesList) {
        p.articlesList = articlesList
        p.edgesList = edgesList
    }

    p.nodesStartPos = () => p.edgesList.map(e => p.articlesList[e[0]].currentPos);
    p.nodesendPos = () => p.edgesList.map(e => p.articlesList[e[1]].currentPos);

    p.getAdjEdgesListIdx = function(Idx: number) {
        const list = []

        p.edgesList.forEach((e, i) => {
            if (e[0] == Idx) {
                list.push({idx: i, dir:  1})
            }else if (e[1] == Idx) {
                list.push({idx: i, dir:  -1})
            }
        })

        return list
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
        else if (idx === p.hoveredIdx) {
            p.animatingBackward = false
            const t = edgeAnimSpeed * ((new Date()).getTime() / 1000 - p.timeOfHover)
            p.timeOfHover = (new Date()).getTime() / 1000 - p.max((1 - t), 0) / edgeAnimSpeed
        }
    }

    p.onHoverEnd = function() {
        if (p.hoveredIdx !== null && !p.animatingBackward) {
            p.animatingBackward = true
            const t = edgeAnimSpeed * ((new Date()).getTime() / 1000 - p.timeOfHover)
            p.timeOfHover = (new Date()).getTime() / 1000 - p.max((1 - t), 0) / edgeAnimSpeed
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
        myShader.setUniform("uHeight", p.height)

        const nodesStartPos = p.nodesStartPos()
        const nodesendPos = p.nodesendPos()

        myShader.setUniform("x1", nodesStartPos.map(pt => pt.x * p.width / p.height))
        myShader.setUniform("y1", nodesStartPos.map(pt => pt.y))
        myShader.setUniform("x2", nodesendPos.map(pt => pt.x * p.width / p.height))
        myShader.setUniform("y2", nodesendPos.map(pt => pt.y))
        myShader.setUniform("scale", p.myScale)
        myShader.setUniform("translation", p.translation.clone().divideScalar(p.height).toArray() )
        if (p.hoveredIdx !== null) {
            // Progress
            const t = edgeAnimSpeed * ((new Date()).getTime() / 1000 - p.timeOfHover)
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

                const showEdges = new Array(p.edgesList.length).fill(0)

                p.getAdjEdgesListIdx(p.hoveredIdx).forEach(e => {
                    showEdges[e.idx] = e.dir
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