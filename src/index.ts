import h from './framework/h'
import ArticleDescription from './articles/ArticleDescription'
import ArticleNode from './components/ArticleNode'
import createBG from './background/main'
// Articles
import BK from './articles/Benharira_Koeppel/description'
import BC from './articles/Boyer_Ciavaldini/description'
import BL from './articles/Brami_Labendzki/description'
import CS from './articles/Chassignet_Salanon/description'
import CL from './articles/Chikar_Lafontaine/description'
import DD from './articles/Daigmorte_DeSmet/description'
import Du from './articles/Dumoulin/description'
import DG from './articles/Durand_Gaillot/description'
import Fo from './articles/Fouchy/description'
import GJ from './articles/Geslin_Julien/description'
import Ha from './articles/Haerinck/description'
import HG from './articles/Haudegond_Guyonneau/description'
import KB from './articles/Kohlmuller_Boyer/description'
import La from './articles/Lagier/description'
import LL from './articles/Lassare_Lesbats/description'
import Li from './articles/Lisacek/description'
import ML from './articles/Mallet_Libert/description'
import MS from './articles/Mansion_Sgro/description'
import MSs from './articles/Maurel_Seguy/description'
import OM from './articles/Ory_MaryVallee/description'
import PF from './articles/Pusung_Fan/description'
import RL from './articles/Rathonie_Lienart/description'
import RV from './articles/Rosenberg_Vallet/description'
import Sa from './articles/Sangare/description'
import SV from './articles/Segaux_Vo/description'
import Th from './articles/Thiel/description'
import VV from './articles/Vallee_Veysset/description'

interface ArticleDescriptionAndPosition {
    desc: ArticleDescription,
    x: number,
    y: number,
}

const articles: ArticleDescriptionAndPosition[] = [
    { desc: BK, x: 0.5, y: 0.8 },
    { desc: BC, x: 0.1, y: 0 },
    { desc: BL, x: 0.2, y: 0 },
    { desc: CS, x: 0.3, y: 0 },
    { desc: CL, x: 0.4, y: 0 },
    { desc: DD, x: 0, y: 0.1 },
    { desc: Du, x: 0.2, y: 0.3 },
    { desc: DG, x: 0.5, y: 0.45 },
    { desc: Fo, x: 0.5, y: 0 },
    // { desc: GJ, x: 0, y: 0 },
    // { desc: Ha, x: 0, y: 0 },
    // { desc: HG, x: 0, y: 0 },
    // { desc: KB, x: 0, y: 0 },
    // { desc: La, x: 0, y: 0 },
    // { desc: LL, x: 0, y: 0 },
    // { desc: Li, x: 0, y: 0 },
    // { desc: ML, x: 0, y: 0 },
    // { desc: MS, x: 0, y: 0 },
    // { desc: MS, x: 0, y: 0 },
    // { desc: OM, x: 0, y: 0 },
    // { desc: PF, x: 0, y: 0 },
    // { desc: RL, x: 0, y: 0 },
    // { desc: RV, x: 0, y: 0 },
    // { desc: Sa, x: 0, y: 0 },
    // { desc: SV, x: 0, y: 0 },
    // { desc: Th, x: 0, y: 0 },
    // { desc: VV, x: 0, y: 0 },
]

const edges = [
    [0, 1],
    [0, 2],
    [4, 1],
    [3, 4],
    [6, 2],
    [7, 8],
    [8, 6],
    [5, 4],
    [5, 6],
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