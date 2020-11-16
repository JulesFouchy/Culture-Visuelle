import h from '../framework/h'
import { ArticleDescription, Category } from '../articles/ArticleDescription'

export default (x: number, y: number, article: ArticleDescription, idx: number) => {
    const radius = 50 // in pixels
    const followLink = "window.location.href = 'articles/"+ article.folderName +"/index.html'"
    const color = article.category === Category.Cultural     ? ' 60, 209,  52' :
                  article.category === Category.Memorisation ? '200, 100, 255' :
                  article.category === Category.Technical    ? ' 59, 156, 247'
                  : '255, 255, 255'
    return h('i', 
        {
            class: `article-thumbnail fas fa-${article.icon}`,
            style: `
                left: calc(${x * 100}vw - ${radius}px);
                top:  calc(${y * 100}vh - ${radius}px);
                width:  ${radius*2}px;
                height: ${radius*2}px;
                color: rgb(${color});
                box-shadow: 0px 0px 10px 3px rgba(${color}, 0.75);
                -webkit-box-shadow: 0px 0px 10px 3px rgba(${color}, 0.75);
                -moz-box-shadow: 0px 0px 10px 3px rgba(${color}, 0.75);
            `,
            onmouseover: `window.dispatchEvent(new CustomEvent('articleHovered', {detail: {idx: ${idx}}}))`,
            onclick: followLink,
        })
}