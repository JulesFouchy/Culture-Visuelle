import h from '../framework/h'
import { ArticleDescription, Category } from '../types/ArticleDescription'

const Header = (description: ArticleDescription) => {
    const rand = Math.floor(Math.random()*2)
    return h(
        'div',
        {
            class: 'article-name'
        },
        description.title
    )
    + h(
        'div',
        {
            class: 'article-authors'
        },    
            description.authors.length == 1
            ? description.authors
            : `${description.authors[rand]} & ${description.authors[(rand+1)%2]}`
    )
    + h(
        'div',
        {
            class: 'article-date'
        },    
            '08.12.2020'
    )
}

const BackArrow = () => h(
    'a',
    {
        class: 'back-arrow fas fa-arrow-left',
        href: './index.html',
    })

export default (description: ArticleDescription) => {
    document.title = description.title
    document.getElementById('header').innerHTML = Header(description)
    document.getElementById('header').classList.add(
          (description.category === Category.Technical)    ? 'technical'
        : (description.category === Category.Cultural)     ? 'cultural'
        : (description.category === Category.Memorisation) ? 'memorisation'
        :                                                    'editorial'
    )
    document.getElementsByClassName('mon-article')[0].classList.add(
          (description.category === Category.Technical)    ? 'technical'
        : (description.category === Category.Cultural)     ? 'cultural'
        : (description.category === Category.Memorisation) ? 'memorisation'
        :                                                    'editorial'
    )
    document.getElementById('wrapper').innerHTML += BackArrow()
}