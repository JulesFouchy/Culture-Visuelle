import h from './framework/h'
import { ArticleDescriptionAndPosition } from './articles/ArticleDescription'
import ArticleThumbnail from './components/ArticleThumbnail'
import ArticleInfos from './components/ArticleInfos'
import createBG from './background/main'
import Point from './components/Point'
import perlin from 'perlin.js'
import PoissonDiskSampling from 'poisson-disk-sampling'
// Articles
import ArticlesDescription from './ArticlesDescription'

const articles: ArticleDescriptionAndPosition[] = []

// Generate ArticlesDescription
const pds = new PoissonDiskSampling({ shape: [1, 1], minDistance: 0.15, maxDistance: 0.3, tries: 10});
pds.addPoint([0.5, 0.5]) // init with a point in the center
const pointsSampling = pds.fill() // generate poisson disk sampling

ArticlesDescription.forEach((d, id) => {
    // Use our generated poison disk sampling and add random fallback if needed
    let randomPos: Point = pointsSampling[id] != null ? Point.fromArray(pointsSampling[id]) : Point.random();

    articles.push({
        desc: d,
        currentPos: randomPos,
        initPos: randomPos
    })
})

// generate edges links
const getNeighbourBydist = (idx : number) => articles.map((a, id) => [id, a]).sort((a, b) => { 
    return articles[idx].currentPos.squareDistanceTo(a[1].currentPos) - articles[idx].currentPos.squareDistanceTo(b[1].currentPos)
}).map(([id, a]) => id);

const randInt = (max) => Math.floor(Math.random() * max)

const edges = []
for (let i = 0; i < articles.length; ++i) {
    const nIdx = getNeighbourBydist(i) // get neighbouring articles index ordered by distance
    // j = 1 because the closest point to a point is itself (index = 0 in the list)
    for (let j = 1; j < Math.min(nIdx.length, 3+randInt(3)); ++j) { 
        edges.push([i, nIdx[j]]);
    }
}

let prevMouse: Point
let isDragging = false
let currentHoveArticle = undefined
const jitterSpeed = 0.001
let time = 0

var bg = createBG()

bg.linkGraph(articles, edges)

const jitterPos = function() {
    articles.forEach((a, id) => {
        const delta = new Point(perlin.simplex2(id, time*jitterSpeed), perlin.simplex2(2752.12 + id, time*jitterSpeed))
        a.currentPos = a.initPos.clone().add(delta.divideScalar(40))
    })
    ++time
}

const init = () => {
    document.body.innerHTML += h('div', {}, articles.map((article, idx) => ArticleInfos(article.desc, idx)))
}

const draw = () => {
    document.getElementById("app").innerHTML =
    h('div',
    {
        id: 'transform-wrapper',
        style: `
            transform-origin: top left;
            transform: matrix(${bg.myScale}, 0, 0, ${bg.myScale}, ${bg.translation.x}, ${bg.translation.y});
        `,
    }, 
        articles.map((article, idx) => ArticleThumbnail(article, idx))
    )
    jitterPos()
    requestAnimationFrame( draw );
}

window.addEventListener('articleHovered', e => {
    if(currentHoveArticle == undefined) {
        currentHoveArticle = e.detail.idx
        
        bg.onHoverStart(currentHoveArticle)
        document.getElementById('article-'+currentHoveArticle).classList.add('visible')
    }

})
window.addEventListener('mousemove', e => {
    if (e.target.id === "defaultCanvas0") {
        bg.onHoverEnd()
        for (let i = 0; i < articles.length; ++i)
            document.getElementById('article-'+i).classList.remove('visible')
        currentHoveArticle = undefined
    }
})
init()
draw()

window.addEventListener("wheel", (e: WheelEvent) => {
    const s = Math.pow(0.95, e.deltaY > 0 ? 1 : -1)
    bg.myScale *= s
    const delta: Point = Point.fromObject(e);
    bg.translation.subtract(delta).multiplyScalar(s).add(delta);
})

window.addEventListener("mousedown", (e: MouseEvent) => {
    isDragging = true
    prevMouse = Point.fromObject(e)

    // Added link behavior here because updating the dom elements for the animation cancels the "onclick" mechanism.
    if(currentHoveArticle != undefined) {
        window.location.href = `articles/${articles[currentHoveArticle].desc.folderName}/index.html`
    }
})

window.addEventListener("mouseup", (e: MouseEvent) => {
    isDragging = false
})

window.addEventListener("mousemove", (e: MouseEvent) => {
    if (isDragging) {
        const delta: Point = Point.fromObject(e);
        bg.translation.add(delta.subtract(prevMouse))
        prevMouse = Point.fromObject(e)
    }
})