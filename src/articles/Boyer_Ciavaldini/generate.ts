import GenerateArticlePage from '../../components/GenerateArticlePage'
import description from './description'

GenerateArticlePage(description)
document.getElementsByClassName("article-date")[0].innerHTML = ""

// Capitalize "BOYER" and "CIAVALDINI" to "Boyer" and "Ciavaldini"
const e = document.getElementsByClassName("article-authors")[0]
const words = e.innerHTML.split(" ")
for (let i = 0; i < words.length; i++)
    words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase()
e.innerHTML = words.join(" ")