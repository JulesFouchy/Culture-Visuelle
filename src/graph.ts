import h from './framework/h'
import { Category, ArticleDescription, ArticleDescriptionAndPosition } from './types/ArticleDescription'
import Point from './components/Point'
import * as TWEEN from '@tweenjs/tween.js';
import perlin from 'perlin.js'
import ArticlesDescription from './ArticlesDescription'
import ArticleInfos from './components/ArticleInfos'

const articles: ArticleDescriptionAndPosition[] = []

const articleColor = function (article: ArticleDescriptionAndPosition) {

    switch (article.desc.category) {
        case Category.Cultural:
            return  '#ffb800';
        case Category.Memorisation:
            return  '#27da79';
        case Category.Technical:
            return  '#6e33ce';
        case Category.Editorial:
            return  '#ff2e2e';
        default:
            return '#ffffff'
    }
}

const articlesPos: Point[] = [
    new Point( 0.47675334909377465, 0.4715984147952444),
    new Point( 0.18875, 0.7463672391017173),
    new Point( 0.290625, 0.6842800528401585),
    new Point( 0.11625, 0.5468956406869221),
    new Point( 0.356875, 0.17965653896961692),
    new Point( 0.638125, 0.12681638044914134),
    new Point( 0.45625, 0.12549537648612946),
    new Point( 0.654375, 0.5085865257595773),
    new Point( 0.253125, 0.4676354029062087),
    new Point( 0.570625, 0.24570673712021135),
    new Point( 0.758125, 0.4478203434610304),
    new Point( 0.68625, 0.31836195508586523),
    new Point( 0.58625, 0.845442536327609),
    new Point( 0.85625, 0.4187582562747688),
    new Point( 0.77125, 0.5997357992073976),
    new Point( 0.7470449172576832, 0.7873183619550859),
    new Point( 0.375, 0.8599735799207398),
    new Point( 0.613125, 0.380449141347424),
    new Point( 0.369375, 0.49273447820343463),
    new Point( 0.419375, 0.6354029062087186),
    new Point( 0.785625, 0.12813738441215325),
    new Point( 0.87125, 0.20079260237780713),
    new Point( 0.469375, 0.29722589167767505),
    new Point( 0.591875, 0.5785997357992074),
    new Point( 0.2425, 0.2747688243064729),
    new Point( 0.16, 0.3989431968295905),
    new Point( 0.07875, 0.21532364597093792),
    new Point( 0.1775, 0.083223249669749),
    new Point( 0.50375, 0.7476882430647291),
];

ArticlesDescription.forEach((d, id) => {
    articles.push({
        desc: d,
        currentPos: articlesPos[id].clone(),
        initPos: articlesPos[id].clone()
    })
})

const edges = [
    [9, 17],
    [11, 9],
    [25, 26],
    [13, 14],
    [2, 16],
    [2, 19],
    [16, 19],
    [7, 10],
    [1, 3],
    [1, 8],
    [3, 8],
    [4, 9],
    [24, 18],
    [6, 27],
    [24, 27],
    [24, 25],
    [22, 17],
    [22, 4],
    [5, 6],
    [16, 18],
    [26, 27],
    [23, 18],
    [16, 12],
    [14, 23],
    [22, 8],
    [3, 4],
    [7, 15],
    [28, 23],
    [28, 15],
    [28, 12],
    [23, 15],
    [23, 12],
    [15, 12],
    // Jeux Vidéos
    [20, 13],
    [20, 11],
    [20, 21],
    [20, 5],
    [20, 10],
    [13, 11],
    [13, 21],
    [13, 5],
    [13, 10],
    [11, 21],
    [11, 5],
    [11, 10],
    [21, 5],
    [21, 10],
    [5, 10],
    // Editorial
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [0, 8],
    [0, 9],
    [0, 10],
    [0, 11],
    [0, 12],
    [0, 13],
    [0, 14],
    [0, 15],
    [0, 16],
    [0, 17],
    [0, 18],
    [0, 19],
    [0, 20],
    [0, 21],
    [0, 22],
    [0, 23],
    [0, 24],
    [0, 25],
    [0, 26],
    [0, 27],
    [0, 28],
]

const Graph = function (canvasId) {
    let scope = this;

    this.canvas = document.getElementById(canvasId);
    
    this.context = this.canvas.getContext("2d");

    this.config = {
        defaultNodeRadius : 33,
        defaultNodeFontSize : 30,
        editorialNodeRadius: 45,
        editorialNodeFontSize : 40,
        pointsColor : "#ffffff",

        jitterSpeed: 0.001,

        linethickness : 2,
        lineColor : '#ffffffee',

        enableClear: true
    };

    this.currentEdges = {
        fromEdge: 0,
        toEdges: [], 
        easing: 1,
        action: undefined,
    }

    this.oldEdgesBuffer = []

    this.mousePosition = Point.zero();
    this.currentHoveArticle = undefined;
    this.heldArticle = undefined
    this.nearestArticleId = 0;
    this.time = 0

    this.drawEges = function (onlySelected : Boolean = false) {

        scope.context.strokeStyle = scope.config.lineColor;
        scope.context.lineWidth = scope.config.linethickness;
        scope.context.beginPath();

        if(!onlySelected) {
            edges.forEach(edge => {
                scope.context.moveTo(articles[edge[0]].currentPos.x * scope.canvas.width, articles[edge[0]].currentPos.y * scope.canvas.height);
                scope.context.lineTo(articles[edge[1]].currentPos.x * scope.canvas.width, articles[edge[1]].currentPos.y * scope.canvas.height);
            });
        }else {
            {
                const fromPos = articles[scope.currentEdges.fromEdge].currentPos;
                scope.currentEdges.toEdges.forEach(edgeId => {
                    const dir = articles[edgeId].currentPos.clone().subtract(fromPos).multiplyScalar(scope.currentEdges.easing);
                    scope.context.moveTo(fromPos.x * scope.canvas.width, fromPos.y * scope.canvas.height);
                    scope.context.lineTo((fromPos.x + dir.x) * scope.canvas.width, (fromPos.y + dir.y) * scope.canvas.height);
                });
            }

            scope.oldEdgesBuffer.forEach(oeb => {
                const fromPos = articles[oeb.fromEdge].currentPos;
                oeb.toEdges.forEach(edgeId => {
                    const dir = articles[edgeId].currentPos.clone().subtract(fromPos).multiplyScalar(oeb.easing);
                    scope.context.moveTo(fromPos.x * scope.canvas.width, fromPos.y * scope.canvas.height);
                    scope.context.lineTo((fromPos.x + dir.x) * scope.canvas.width, (fromPos.y + dir.y) * scope.canvas.height);
                });
            });
        }
        scope.context.stroke();
    };

    this.jitter = function() {
        articles.forEach((a, id) => {
            const delta = new Point(perlin.simplex2(id, scope.time*scope.config.jitterSpeed), perlin.simplex2(2752.12 + id, scope.time*scope.config.jitterSpeed))
            a.currentPos = a.initPos.clone().add(delta.divideScalar(60))
        })
        ++scope.time
    }

    this.updateEdges = function() {
        const currentNearestArticleId = scope.nearestArticleId;
        scope.computeNearest();


        if(currentNearestArticleId != scope.nearestArticleId) {

            // add old to buffer animation edges
            scope.oldEdgesBuffer.push(
                {
                    fromEdge: scope.currentEdges.fromEdge,
                    toEdges: scope.currentEdges.toEdges,
                    easing: scope.currentEdges.easing,
                    action: undefined
                }
            );
            scope.oldEdgesBuffer[scope.oldEdgesBuffer.length-1].action = new TWEEN.Tween(scope.oldEdgesBuffer[scope.oldEdgesBuffer.length-1]).easing(TWEEN.Easing.Cubic.Out).to({"easing": 0.0}, 800).start();

            // new edges
            scope.currentEdges.fromEdge = scope.nearestArticleId
            scope.currentEdges.toEdges = edges.filter(e => e.includes(scope.nearestArticleId)).map(e => e[0] == scope.nearestArticleId ? e[1] : e[0]);
            scope.currentEdges.easing = 0.0;
            if(scope.currentEdges.action) scope.currentEdges.action.stop();
            scope.currentEdges.action = new TWEEN.Tween(scope.currentEdges).easing(TWEEN.Easing.Cubic.Out).to({"easing": 1.0}, 800).start();
        }
    }

    this.computeNearest = function () {
        let currentNearestDist = articles[scope.nearestArticleId].currentPos.clone().multiplyValues(scope.canvas.width,scope.canvas.height).subtract(scope.mousePosition).mag2();

        for (let i = 0; i < articles.length; i++) {
            const dist = articles[i].currentPos.clone().multiplyValues(scope.canvas.width,scope.canvas.height).subtract(scope.mousePosition).mag2();
            if (dist < currentNearestDist) {
                currentNearestDist = dist;
                scope.nearestArticleId = i
            }
        }
    }

    this.drawCircles = function () {
        
        scope.context.textAlign='center';
        scope.context.textBaseline='middle';
        articles.forEach((article, id) => {
            scope.context.font = `${id === 0 ? scope.config.editorialNodeFontSize : scope.config.defaultNodeFontSize}px fontawesome`;
            scope.context.shadowBlur = 8;
            const color = articleColor(article);
            scope.context.fillStyle='#ffffff';
            scope.context.shadowColor=color;
            
            const x = article.currentPos.x * scope.canvas.width;
            const y = article.currentPos.y * scope.canvas.height;

            // let r = perlin.simplex2(75858 + id, scope.time*scope.config.jitterSpeed)
            // r = 1+r/10;

            scope.context.beginPath();
            scope.context.arc(x, y, id === 0 ? scope.config.editorialNodeRadius : scope.config.defaultNodeRadius, 0, 2*Math.PI); 
            scope.context.fillStyle = scope.config.pointsColor;
            scope.context.fill();

            scope.context.shadowBlur = 0;

            scope.context.fillStyle=color;
            scope.context.fillText(article.desc.iconUnicode || "\uf013", x, y);
        });
    };

    this.getOverArticleId = function () {
        let id = undefined;

        const normalRadiusSq = scope.config.defaultNodeRadius * scope.config.defaultNodeRadius;
        for (let i = 0; i < articles.length; ++i) {
            const article: ArticleDescription = articles[i];
            const radiusSq = i === 0 ? scope.config.editorialNodeRadius*scope.config.editorialNodeRadius : normalRadiusSq;
            if(article.currentPos.clone().multiplyValues(scope.canvas.width,scope.canvas.height).subtract(scope.mousePosition).mag2() < radiusSq) {
                id = i;
                break;
            }
        };
        if(scope.currentHoveArticle != undefined)
            document.getElementById('article-'+scope.currentHoveArticle).classList.remove('visible')

        if(scope.currentHoveArticle != id) {
            scope.currentHoveArticle = id;
            document.body.style.cursor = scope.currentHoveArticle != undefined ? 'pointer' : 'default';
        }

        if(scope.currentHoveArticle != undefined)
            document.getElementById('article-'+scope.currentHoveArticle).classList.add('visible')

        return scope.currentHoveArticle;
    };

    this.fit = function () {
        scope.canvas.width = scope.canvas.parentNode.offsetWidth;
        scope.canvas.height = scope.canvas.parentNode.offsetHeight;
    };

    this.clear = function () {
        scope.context.clearRect(0, 0, scope.canvas.width, scope.canvas.height);
    };

    this.update = function() {
        if(scope.config.enableClear) scope.clear();
        
        scope.jitter();
        scope.drawEges(true);
        scope.drawCircles();
        TWEEN.update();
        scope.oldEdgesBuffer = scope.oldEdgesBuffer.filter(edges => edges.easing > 0)
        requestAnimationFrame(scope.update);
    };

    this.getMouseInput = function (e) {
        scope.mousePosition.set(e.offsetX, e.offsetY);
    };

    this.init = function () {

        document.getElementById("articlesInfos").innerHTML = h('div', {}, articles.map((article, idx) => ArticleInfos(article.desc, idx)))

        scope.fit();
        scope.update();

        scope.canvas.addEventListener("mousemove", function (e) {
            scope.getMouseInput(e);
            scope.getOverArticleId();
            // scope.computeNearest();
            scope.updateEdges();
            
            if (scope.heldArticle !== undefined) {
                articlesPos[scope.heldArticle].set(scope.mousePosition.x / scope.canvas.width, scope.mousePosition.y / scope.canvas.height)
                articles[scope.heldArticle].currentPos = articlesPos[scope.heldArticle].clone()
                articles[scope.heldArticle].initPos = articlesPos[scope.heldArticle].clone()
            }
             
        });

        window.addEventListener( 'resize', function (e) {
            scope.canvas.width  = window.innerWidth;
            scope.canvas.height = window.innerHeight;
        });

        scope.canvas.addEventListener('mousedown',  function (e) {
            
            if(scope.currentHoveArticle != undefined) {
                scope.heldArticle = scope.currentHoveArticle
                // const link = `./${articles[scope.currentHoveArticle].desc.folderName}.html`
                // if (e.ctrlKey) {
                //     // Open in a new tab
                //     window.open(link)
                // }
                // else {
                //     window.location.href = link
                // }
            }
        });

        window.addEventListener('keydown',  function (e) {
            if (e.key==" "){
                let str = ""
                articlesPos.forEach(p => {
                    str += `new Point( ${p.x}, ${p.y}),\n`
                })
                console.log(str)
            }
        });

        scope.canvas.addEventListener('mouseup',  function (e) {
            
                scope.heldArticle = undefined
        });

    }();

};


window.addEventListener("load", function(){
    const mainGraph = new Graph('graph');
});
