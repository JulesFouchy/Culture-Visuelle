import h from '../framework/h'
import ArticleDescription from '../articles/ArticleDescription'

export default (x: number, y: number, article: ArticleDescription) => {
    const radius = 70 // in pixels
    const a = "df"
    return h('img', 
    {
        class: "article-node",
        style: `
            left: calc(${x * 100}vw - ${radius/2}px);
            top:  calc(${y * 100}vh - ${radius/2}px);
            width:  ${radius}px;
            height: ${radius}px;
        `,
        onclick: "window.location.href = 'articles/"+ article.folderName +"/index.html'",
        src: article.thumbnail
    },
    "")}