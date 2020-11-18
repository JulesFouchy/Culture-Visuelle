import h from '../framework/h'
import { Category , ArticleDescriptionAndPosition } from '../articles/ArticleDescription'

export default (article : ArticleDescriptionAndPosition, idx: number, radius: number = 50) => {
    const followLink = "window.location.href = 'articles/"+ article.desc.folderName +"/index.html'"
    const color = article.desc.category === Category.Cultural     ? ' 255, 184, 0' :
                  article.desc.category === Category.Memorisation ? '39, 218, 121' :
                  article.desc.category === Category.Technical    ? ' 110, 51, 206'
                  : '255, 255, 255'
    return h('i', 
        {
            id: `article-thumbnail-${idx}`,
            class: `article-thumbnail fas fa-${article.desc.icon}`,
            style: `
                left: calc(${article.currentPos.x * 100}vw - ${radius}px);
                top:  calc(${article.currentPos.y * 100}vh - ${radius}px);
                width:  ${radius*1.75}px;
                height: ${radius*1.75}px;
                color: rgb(${color});
                box-shadow: 0px 0px 10px 3px rgba(${color}, 0.5);
                -webkit-box-shadow: 0px 0px 10px 3px rgba(${color}, 0.5);
                -moz-box-shadow: 0px 0px 10px 3px rgba(${color}, 0.5);
            `,
            onmouseover: `window.dispatchEvent(new CustomEvent('articleHovered', {detail: {idx: ${idx}}}))`,
            onclick: followLink,
        })
}