import h from '../framework/h'
import ArticleDescription from '../articles/ArticleDescription'

export default (x: number, y: number, article: ArticleDescription) => {
    const radius = 50 // in pixels
    const followLink = "window.location.href = 'articles/"+ article.folderName +"/index.html'"
    return h(
    'div', 
    {
        class: "article-node",
        style: `
            left: calc(${x * 100}vw - ${radius}px);
            top:  calc(${y * 100}vh - ${radius}px);
        `,
    }, [
        h('img', 
        {
            class: "article-thumbnail",
            style: `
                width:  ${radius*2}px;
                height: ${radius*2}px;
            `,
            onclick: followLink,
            src: article.thumbnail
        }),
        h('div',
        {
            class: "article-infos",
            style: `
                height: ${radius*2}px;
                left: ${radius}px;
                padding-left: ${radius+5}px;
            `,
            onclick: followLink,
        },
            [
                h('b', {}, article.title),
                h('br', {}),
                h('i', {}, article.brief),
            ]
        )
    ])
}