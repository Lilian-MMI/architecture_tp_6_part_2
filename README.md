# Archiecture logicielle TP 6 (part 2)
## Introduction
Ce framework offre un CLI (command line interface) facilitant l'implémentation de filtre, sous une architecture pipe/filtrer. De plus, celle-ci utilise du multithreading sous NodeJs permettant ainsi d'exécuter plusieurs filtres simultanément. Tout comme l'utilisation de fonction asynchrone, les workers permettant d'exécuter des tâches en parallèle de façon non bloquant.
Dans le cas de notre framework, cela signifie que plusieurs filtres peuvent s'exécuter en parallèle, sans bloquer les autres pour autant. Voici une comparaison de fonctionnement entre un framework (nos concurrents) qui exécute des filtres à la suite et un framework (nous) qui exécute les filtres en parallèle.
<img src="https://images.ctfassets.net/hspc7zpa5cvq/20h5efXHT4bQbuf44mdq2H/a40944191d031217a9169b17a8ef35d6/worker-diagram_2x__1_.jpg"> <br />
À la racine du projet on retrouve un fichier <i>app.js</i>. Ce fichier analyse les commandes, les paramètres, et les options passer dans le terminal, afin de vous fournir un CLI optimal. En fonction des commandes passer dans ce terminal, <i>app.js</i> appellera les commandes correspondante. Ces commandes sont répertoriées dans le dossier <b>commands</b>. Ces commandes prennent un ou plusieurs paramètres, optionnel ou obligatoire. Nous reparlerons des commandes disponibles dans la section suivante.
Le dossier <b>confits</b> quant à lui contient un dossier <b>templates</b> qui reprend tous les fichiers nécessaires lors de la création d'un nouveau projet. À la racine du dossier on retrouve aussi <i>defaultFiter.js</i> qui est le fichier par défaut ajouter à un projet via la commande add_step. 
Chaque nouveau projet est créé dans le dossier <b>projets</b> avec les fichiers de confits précédent.
On retrouve également les fichiers propres à l'environnement nodejs, et un .gitignore.
<br> <br>
Voici l'arborescence du framework : <br>
<br>

```
* commandes/
    - addStep.js
    - chooseProject.js
    - createFilter.js
    - createProject.js
    - deleteFilter.js
    - deleteStep.js

* configs/
    * templates/
        ...
    - defaultFiter.js

* projects/
    ...

- .gitignore
- app.js
- package-lock.json
- package.json
- README.md 
```

## Getting started

Tout d'abord, pour exécuter les différentes commandes, vous devez installer toutes les dépendances nécessaires au bon fonctionnement de ce framework. Pour cela, exécuter simplement la commande npm install ppft -g (nécessite la préinstallation de node sur votre machine).

Voici la liste des différentes commandes que propose le framework : <br>

<b>Initier un nouveau projet</b>

> ppft new < projectName >

Description: Créé l'arborescence projet avec un fichier de configuration vierge, et éventuellement un template de filtrer de type hello world.

Alias: n

Paramètres: 
- nom du projet (obligatoire)

<b>Ajouter un filtre</b>

> ppft add_filter < filterName > < projectName >

Description: Créé un nouveau filtre dans un projet existant.

Alias: af

Paramètres: 
- nom du filtre (obligatoire)
- nom du projet (facultative via choose_project commande)

<b>Supprimer un filtre</b>

> ppft del_filter < filterName > < projectName >

Description: Supprimer un filtrer existant. Suppression possible si le filtre n'est pas spécifié dans le <i>config-filters.json</i> du projet en question.

Alias: df

Paramètres: 
- nom du filtre (obligatoire)
- nom du projet (facultative via choose_project commande) 

<b>Ajouter une étape</b>

> ppft add_step < idStep > < filterName > < nextStepId >

Description: Ajoute une step au fichier de configuration.

Alias: as

Paramètres: 
- id de l'étape (obligatoire)
- nom du filtre (obligatoire)
- id de l'étape suivante (facultative)
- nom du projet (facultative via choose_project commande) 

<b>Supprimer un filtre</b>

> ppft del_filter < filterName > < projectName >

Description: Supprimer un filtrer existant. Suppression possible si le filtre n'est pas spécifié dans le <i>config-filters.json</i> du projet en question.

Alias: df

Paramètres: 

- nom du filtre (obligatoire)
- nom du projet (facultative via choose_project commande)

<b>Supprimer une étape du fichier de configuration</b>

> ppft del_step < idStep > < projectName >

Description: Supprime une step du fichier de configuration <i>config-filters.json</i>.
<b>Attention ! Les étapes orphelines ne seront pas supprimées.</b>

Alias: ds

Paramètres: 
- id de l'étape (obligatoire)
- nom du projet (facultative via choose_project commande)

<b>Choisir un dossier de travail</b>

> ppft choose_project < projectName >

Description: Afin de ne pas avoir à indiquer le nom du projet dans lequel vous exécutez toutes ces commandes, vous pouvez spécifier un nom de projet depuis cette commande.

Alias: cp

Paramètres: 
- nom du projet (obligatoire) <br>

<b>Les alias</b> <br>

Pour gagner du temps, vous pouvez utiliser les alias de la façon suivante:
Pour ajouter un filtre : <br>

> ppft as 10 capitalize 15

## API

Lors de la création d'un nouveau projet à partir de ce framework seront générés un ensemble de fichiers. Le fichier <i>app.js</i> est l'entrée du script et ne nécessite aucun ajustement (c'est à vos risques et périls). Ce fichier va lire le <i>config-filters.json</i>, autre fichier important et nous y reviendrons juste après. Le <i>app.js</i> fait appel par le biais de worker chacun des filtres. 

<br>
Le fichier <i>config-filters.json</i> contient un objet "steps" où les différentes étapes de chaque filtre doivent être lister.
Il se présente de la sorte : 

<br>

```
{
  "steps": {
    "1": {
      "filter": "read.js",
      "params": ["./text.txt"],
      "next": ["2"]
    },
    "2": {
      "filter": "capitalize.js",
      "params": [],
      "next": ["3"]
    },
    "3": {
      "filter": "write.js",
      "params": ["./textOut1.txt"]
    },
  }
}
```

Chaque étape contient un objet avec un attribut **filtrer**, obligatoire, qui se réfère au nom du filtre présent dans le dossier filters. Ainsi qu'un attribut **params**, un array obligatoire, pouvant être vide et qui prend des paramètres qui seront ensuite accessibles dans le script du filtre en question. Aussi, l'objet **next** est un array, facultatif, qui spécifie le prochain filtre à être exécuté à la suite de celui-ci. Plusieurs filtres peuvent être spécifiés dans cet array et chaque filtre appelé reprendra le résultat du filtre actuel.

<br>

Pour manipuler les filtres et les données, rien de compliquer. Les paramètres peuvent être accédés par l'intermédiaire de l'array <b>workerData</b>. Et chaque filtre doit obligatoirement retourner un message au thread parent via l'intermédiaire de parentPort.postMessage(<i> < contenu > </i>). 

Pour rejeter une erreur, vous pouvez passer un objet erreur de la sorte, qui sera capturée par l'<i>app.js</i> 
    
<br>

```
{error: true, err: <contenu du message d'erreur>}
```

## Errors

## Tools

Pour installer le framework, executer la commande npm i -g ppft. Celui vous permettra d'executer toutes les commandes rapidement, comme indiquer précedemment. Ainsi, toutes les dépendances pour instancier ce framework seront installées. Pour ce framework NodeJs, les dépendances nécessaires à son bon fonctionnement sont les suivantes :
<br>
- <a href="https://www.npmjs.com/package/chalk" target="_blank">chalk</a>, pour la personnalisation de couleur du terminal.
- <a href="https://www.npmjs.com/package/commander" target="_blank">commander</a>, pour la création simplifier de command line interface (CLI).
- <a href="https://www.npmjs.com/package/conf" target="_blank">conf</a>, pour rendre des données persistantes (utilisé ici pour le nom du projet < projectName >).
- <a href="https://www.npmjs.com/package/ncp" target="_blank">ncp</a>, pour copier coller un ensemble de fichier dans un dossier (dans le cas de ce framework, les fichiers initials d'un projet).



