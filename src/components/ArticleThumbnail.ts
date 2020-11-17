import h from '../framework/h'
import { Category , ArticleDescriptionAndPosition } from '../articles/ArticleDescription'

export default (article : ArticleDescriptionAndPosition, idx: number, radius: number = 50) => {
    const followLink = "window.location.href = 'articles/"+ article.desc.folderName +"/index.html'"
    const color = article.desc.category === Category.Cultural     ? ' 60, 209,  52' :
                  article.desc.category === Category.Memorisation ? '200, 100, 255' :
                  article.desc.category === Category.Technical    ? ' 59, 156, 247'
                  : '255, 255, 255'
    return h('i', 
        {
            id: `article-thumbnail-${idx}`,
            class: `article-thumbnail fas fa-${article.desc.icon}`,
            style: `
                left: calc(${article.currentPos.x * 100}vw - ${radius}px);
                top:  calc(${article.currentPos.y * 100}vh - ${radius}px);
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