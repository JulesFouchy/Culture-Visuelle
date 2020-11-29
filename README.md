# Magazine de Culture Visuelle

Lien vers le magazine : [julesfouchy.github.io/Culture-Visuelle/](https://julesfouchy.github.io/Culture-Visuelle/)

## Écrire son article

Dans le dossier **./src/articles** vous trouverez :
  - Le fichier **\[vos_noms\]/description.ts**, dans lequel vous devez renseigner :
    - le **titre** de votre article
    - sa **catégorie** : Technical, Cultural ou Memorisation
    - l'**icone** qui le représentera, choisi parmi cette liste : [fontawesome.com/cheatsheet](https://fontawesome.com/cheatsheet).
    - le nom des auteurs
  - Le fichier **\[vos_noms\].html** où vous mettrez votre article **dans le div "mon-article"**. Vous êtes libres de faire ce que vous voulez sur cette page. Un style de base est déjà appliqué à toutes les pages, donc pas besoin de vous embêter avec ça. Ceci dit, si vous voulez rajouter votre style bien particulier c'est tout à fait possible.
    - N'hésitez pas à profiter du format web pour enrichir votre article avec des liens, images, vidéos *etc.* :wink:.
    - Mettez des balises \<h1\>, \<h2>, \<h3> au besoin, \<b> pour le **gras**, \<i> pour l'*italique*...
    - Utilisez **\<br/>** pour revenir à la ligne et **\<br/>\<br/>** pour un saut de ligne.
    - Vous pouvez rajouter **\<span class="indent"\>\</span\>** au début de vos paragraphes pour leur mettre un alinéa.
    - Vous pouvez ajouter toutes les ressources que vous voulez dans votre dossier (image, css, son, *etc.*) et les lier *en utilisant un chemin relatif*, par exemple **\<img src="./\[vos_noms\]/mon_image.jpg"/\>**
    - **Si vous faites votre propre style** et que le style de base vous gêne trop, vous n'êtes pas obligés d'inclure *Article.scss* (mais gardez *ArticleMin.scss* !)

Si vous n'êtes pas à l'aise avec le html ou que vous rencontrez des problèmes pour faire des choses avancées, demandez-moi (jules.fouchy@ntymail.com). Et au pire vous m'enverrez un fichier texte ou pdf et je m'occuperai de faire la conversion.

## Récupérer et lancer le projet

Si vous voulez tester le rendu de votre article :  
Il faut avoir npm installé. Après avoir cloné le projet, faites

```
npm install
```

Puis à chaque fois que vous voulez lancer le projet

```
npm run dev
```

et allez à [localhost:1234/index.html](http://localhost:1234/index.html).
  
## Envoyer son article

Le plus simple pour moi est que vous fassiez une *pull request* ; si vous ne savez pas faire, c'est l'occasion d'apprendre :wink: ; et si jamais vous n'y arrivez pas, envoyez-moi vos fichiers par mail (jules.fouchy@ntymail.com).
