import h from './framework/h'
import ArticleNode from './components/ArticleNode'
import MonSuperArticle from './articles/MonSuperArticle/description'
import Deuxieme from './articles/Deuxieme/description'
import GraphOrganizationOfInformation from './articles/GraphOrganizationOfInformation/description'
import createBG from './background/main'

let prevMouseX: number
let prevMouseY: number
let isDragging = false

const draw = () => {
    document.getElementById("app").innerHTML = h('div', 
    {
        id: 'transform-wrapper',
        style: `
            transform-origin: top left;
            transform: matrix(${bg.myScale}, 0, 0, ${bg.myScale}, ${bg.translationX}, ${bg.translationY});
        `,
    }, [
        ArticleNode(0.5, 0.5, MonSuperArticle),
        ArticleNode(0.0, 0.0, Deuxieme),
        ArticleNode(0.8, 0.4, GraphOrganizationOfInformation),
    ])
}

const bg = createBG()
draw()

window.addEventListener("wheel", (e: WheelEvent) => {
    const s = Math.pow(0.95, e.deltaY > 0 ? 1 : -1)
    bg.myScale *= s
    bg.translationX = s * (bg.translationX - e.x) + e.x
    bg.translationY = s * (bg.translationY - e.y) + e.y
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
        bg.translationX += e.x - prevMouseX
        bg.translationY += e.y - prevMouseY
        prevMouseX = e.x
        prevMouseY = e.y
        draw()
    }
})