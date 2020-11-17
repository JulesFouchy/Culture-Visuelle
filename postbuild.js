const fs = require("fs")
const path = require('path')
const replace = require('replace-in-file')

const articlesDir = 'docs/articles'

fs.readdir(path.join(__dirname, articlesDir), function (err, list) {
    if (err)
        throw(err)
    list.forEach( dirName => {
        replace.sync({
            files: path.join(__dirname, articlesDir, dirName, 'index.html'),
            from: 'href="ArticlePage.',
            to: 'href="../../ArticlePage.'
        })
        replace.sync({
            files: path.join(__dirname, articlesDir, dirName, 'index.html'),
            from: 'script src="generate.',
            to: 'script src="../../generate.'
        })
        replace.sync({
            files: path.join(__dirname, articlesDir, dirName, 'index.html'),
            from: 'script src="starBackground.',
            to: 'script src="../../starBackground.'
        })
        // Enguerrand
        replace.sync({
            files: path.join(__dirname, articlesDir, dirName, 'index.html'),
            from: 'src="3dnodes.',
            to: 'src="../../3dnodes.'
        })
    })
})