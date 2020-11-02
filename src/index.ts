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
import SM from './articles/Maurel_Seguy/description'
import OM from './articles/Ory_MaryVallee/description'
import PF from './articles/Pusung_Fan/description'
import RL from './articles/Rathonie_Lienart/description'
import RV from './articles/Rosenberg_Vallet/description'
import Sa from './articles/Sangare/description'
import SV from './articles/Segaux_Vo/description'
import Th from './articles/Thiel/description'
import VV from './articles/Valley_Veysset/description'

interface ArticleDescriptionAndPosition {
    desc: ArticleDescription,
    x: number,
    y: number,
}

const articles: ArticleDescriptionAndPosition[] = [
    { desc: BK, x: 0.24816731376553577, y: 0.8136793362360089 },
    { desc: BC, x: 0.2728674319439582, y: 0.17844615748290543 },
    { desc: BL, x: 0.03170845279662466, y: 0.6438729884708927 },
    { desc: CS, x: 0.429056241749672, y: 0.02316006432037176 },
    { desc: CL, x: 0.3050340862596753, y: -0.012866702400206577 },
    { desc: DD, x: 0.11645595707996063, y: 0.21876204814092132 },
    { desc: Du, x: 0.1354718791251641, y: 0.4646937907226443 },
    { desc: DG, x: 0.564528120874836, y: 0.8823212006469412 },
    { desc: Fo, x: 0.5535705154432602, y: 0.06948019296111549 },
    { desc: GJ, x: -0.18311071809949322, y: 0.33613616685419645 },
    { desc: Ha, x: 0.017726970564860625, y: -0.39944677601441314 },
    { desc: HG, x: -0.09999119334241684, y: 0.1509585859104236 },
    { desc: KB, x: -0.01556893105069737, y: -0.018585951617098362 },
    { desc: La, x: -0.09230869442316741, y: 0.6281009443684842 },
    { desc: LL, x: 0.8572073853536112, y: 0.38552500401738954 },
    { desc: Li, x: 0.6683621870782597, y: 0.333421292647753 },
    { desc: ML, x: 0.647195745919599, y: 0.06967319349711865 },
    { desc: MS, x: 0.5142404229038579, y: -0.2740478944219997 },
    { desc: SM, x: 0.8003495882808783, y: 0.15353835974166496 },
    { desc: OM, x: 0.7994455858327734, y: -0.1795869987508831 },
    { desc: PF, x: 0.7789213821035742, y: 0.8035512982977009 },
    { desc: RL, x: 0.40128577358002987, y: 0.7514733203328646 },
    { desc: RV, x: 0.07361988960375745, y: -0.20901958049135577 },
    { desc: Sa, x: 0.3388487290750527, y: -0.33875454079263884 },
    { desc: SV, x: 0.2230572774561607, y: -0.31352937073703363 },
    { desc: Th, x: 0.37503236742673124, y: 0.4059799771161062 },
    { desc: VV, x: 0.16942102067453896, y: 0.030815080052763122 },
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
    [11, 9],
    [25, 8],
    [16, 17],
    [10, 24],
    [22, 24],
    [10, 22],
    [12, 22],
    [10, 11],
    [11, 6],
    [26, 24],
    [23, 17],
    [23, 8],
    [4, 23],
    [3, 17],
    [16, 19],
    [14, 15],
    [7, 15],
    [7, 20],
    [14, 20],
    [15, 21],
    [25, 21],
    [2, 13],
    [12, 26],
    [16, 18],
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