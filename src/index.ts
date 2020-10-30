import h from './framework/h'
import ArticleDescription from './articles/ArticleDescription'
import ArticleNode from './components/ArticleNode'
import MonSuperArticle from './articles/MonSuperArticle/description'
import Deuxieme from './articles/Deuxieme/description'
import GraphOrganizationOfInformation from './articles/GraphOrganizationOfInformation/description'
import createBG from './background/main'

interface ArticleDescriptionAndPosition {
    desc: ArticleDescription,
    x: number,
    y: number,
}

const articles: ArticleDescriptionAndPosition[] = [
    {desc: MonSuperArticle, x: 0.5, y: 0.5},
    {desc: Deuxieme, x: 0, y: 0},
    {desc: GraphOrganizationOfInformation, x: 0.8, y: 0.4},
]

const edges = [
    [0, 1],
    [0, 2],
]

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
    }, 
        articles.map(article => ArticleNode(article.x, article.y, article.desc))
    )
}

const bg = createBG()
edges.forEach(pair => {
    bg.nodesX1.push(articles[pair[0]].x)
    bg.nodesY1.push(articles[pair[0]].y)
    bg.nodesX2.push(articles[pair[1]].x)
    bg.nodesY2.push(articles[pair[1]].y)
})
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