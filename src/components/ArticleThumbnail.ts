import h from '../framework/h'
import ArticleDescription from '../articles/ArticleDescription'

export default (x: number, y: number, article: ArticleDescription, idx: number) => {
    const radius = 50 // in pixels
    const followLink = "window.location.href = 'articles/"+ article.folderName +"/index.html'"
    return h('i', 
        {
            class: `article-thumbnail fas fa-${article.icon}`,
            style: `
                left: calc(${x * 100}vw - ${radius}px);
                top:  calc(${y * 100}vh - ${radius}px);
                width:  ${radius*2}px;
                height: ${radius*2}px;
            `,
            onmouseover: `window.dispatchEvent(new CustomEvent('articleHovered', {detail: {idx: ${idx}}}))`,
            onclick: followLink,
        })
}