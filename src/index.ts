import h from './framework/h'
import ArticleNode from './components/ArticleNode'
import MonSuperArticle from './articles/MonSuperArticle/description'
import Deuxieme from './articles/Deuxieme/description'
import InitBG from './background/main'

let myscale = 1
let translationX = 0 // in pixels
let translationY = 0 // in pixels
let prevMouseX: number
let prevMouseY: number
let isDragging = false

const draw = () => {
    document.getElementById("app").innerHTML = h('div', 
    {
        id: 'transform-wrapper',
        style: `
            transform-origin: top left;
            transform: matrix(${myscale}, 0, 0, ${myscale}, ${translationX}, ${translationY});
        `,
    }, [
        ArticleNode(0.5, 0.5, MonSuperArticle),
        ArticleNode(0.0, 0.0, Deuxieme),
    ])
}

InitBG()
draw()

window.addEventListener("wheel", (e: WheelEvent) => {
    const s = Math.pow(0.95, e.deltaY > 0 ? 1 : -1)
    myscale *= s
    translationX = s * (translationX - e.x) + e.x
    translationY = s * (translationY - e.y) + e.y
    draw()
})

window.addEventListener("mousedown", (e: MouseEvent) => {
    isDragging = true
    prevMouseX = e.x
    prevMouseY = e.y
})

window.addEventListener("mouseup", (e: MouseEvent) => {
    isDragging = false
})

window.addEventListener("mousemove", (e: MouseEvent) => {
    if (isDragging) {
        translationX += e.x - prevMouseX
        translationY += e.y - prevMouseY
        prevMouseX = e.x
        prevMouseY = e.y
        draw()
    }
})