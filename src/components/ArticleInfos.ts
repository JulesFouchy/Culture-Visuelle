import h from '../framework/h'
import { ArticleDescription } from '../types/ArticleDescription'

export default (article: ArticleDescription, idx: number) => {
    const rand = Math.floor(Math.random()*2)
    return h('div',
        {
            class: "article-infos",
            id: "article-"+idx
        },
        [
            h('span',
            {
                class: "article-name"
            },
                article.title + ", "
            ),
            h('span',
            {
                class: "article-authors"
            },
                article.authors.length == 1
                ? article.authors
                : `${article.authors[rand]} & ${article.authors[(rand+1)%2]}`
            ),
        ])
}