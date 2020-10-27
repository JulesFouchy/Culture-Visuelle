import ArticleNode from './components/ArticleNode'
import MonSuperArticle from './articles/MonSuperArticle/description'
import Deuxieme from './articles/Deuxieme/description'

document.body.innerHTML += ArticleNode(0.5, 0.5, MonSuperArticle)
document.body.innerHTML += ArticleNode(0.2, 0.5, Deuxieme)