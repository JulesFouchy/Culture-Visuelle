import h from '../framework/h'
import ArticleDescription from '../articles/ArticleDescription'

export default (x: number, y: number, article: ArticleDescription, idx: number) => {
    const radius = 50 // in pixels
    const followLink = "window.location.href = 'articles/"+ article.folderName +"/index.html'"
    const rand = Math.floor(Math.random()*2)
    return h(
    'div', 
    {
        class: "article-node",
        style: `
            left: calc(${x * 100}vw - ${radius}px);
            top:  calc(${y * 100}vh - ${radius}px);
        `,
        onmouseover: `window.dispatchEvent(new CustomEvent('articleHovered', {detail: {idx: ${idx}}}))`,
    }, [
        h('img', 
        {
            class: "article-thumbnail",
            style: `
                width:  ${radius*2}px;
                height: ${radius*2}px;
            `,
            onclick: followLink,
            src: article.thumbnail,
        }),
    ])
}