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
    new Point( 0.5, 0.5),
    new Point( 0.24816731376553577, 0.8136793362360089),
    new Point( 0.2728674319439582, 0.17844615748290543),
    new Point( 0.03170845279662466, 0.6438729884708927),
    new Point( 0.429056241749672, 0.02316006432037176),
    new Point( 0.3050340862596753, 0.012866702400206577),
    new Point( 0.11645595707996063, 0.21876204814092132),
    new Point( 0.1354718791251641, 0.4646937907226443),
    new Point( 0.564528120874836, 0.8823212006469412),
    new Point( 0.5535705154432602, 0.06948019296111549),
    new Point( 0.18311071809949322, 0.33613616685419645),
    new Point( 0.017726970564860625, 0.39944677601441314),
    new Point( 0.09999119334241684, 0.1509585859104236),
    new Point( 0.01556893105069737, 0.018585951617098362),
    new Point( 0.09230869442316741, 0.6281009443684842),
    new Point( 0.8572073853536112, 0.38552500401738954),
    new Point( 0.3799249530956848, 0.1955085865257596),
    new Point( 0.647195745919599, 0.06967319349711865),
    new Point( 0.5142404229038579, 0.2740478944219997),
    new Point( 0.7003495882808783, 0.15353835974166496),
    new Point( 0.7994455858327734, 0.1795869987508831),
    new Point( 0.7789213821035742, 0.8035512982977009),
    new Point( 0.40128577358002987, 0.7514733203328646),
    new Point( 0.07361988960375745, 0.20901958049135577),
    new Point( 0.3388487290750527, 0.33875454079263884),
    new Point( 0.2230572774561607, 0.31352937073703363),
    new Point( 0.37503236742673124, 0.4059799771161062),
    new Point( 0.16942102067453896, 0.030815080052763122),
    new Point( 0.7, 0.5),
];

ArticlesDescription.forEach((d, id) => {
    articles.push({
        desc: d,
        currentPos: articlesPos[id].clone(),
        initPos: articlesPos[id].clone()
    })
})

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
