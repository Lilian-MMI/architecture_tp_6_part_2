# Archiecture logicielle TP 6 (part 2)

## Introduction

Ce framework offre un CLI (command line interface) facilitant l'implémentation de filtre, sous une architecture pipe/filter. De plus, celle-ci utilise du multi-threading sous NodeJs permettant ainsi d'executer plusieurs filtre simultannement. Tout comme l'utilisation de fonction asynchrone, les workers permettent d'executer des tâches en parrallèle de façon non bloquant.

Dans le cas de notre framework cela signifie que plusieurs filtres peuvent s'executer en parrallèle, sans bloquer les autres pour autant. Voici une comparaison de fonctionnement entre un framework (nos concurrents) qui execute des filtres à la suite et un framework (nous) qui execute les filtres en parrallèle.

<img src="https://images.ctfassets.net/hspc7zpa5cvq/20h5efXHT4bQbuf44mdq2H/a40944191d031217a9169b17a8ef35d6/worker-diagram_2x__1_.jpg">

<br />
A la racine du projet on retrouve un fichier <i>app.js</i>. Ce fichier analyse les commandes, les paramètres, et les options passer dans le terminal, afin de vous fournir un CLI optimal. En fonction des commandes passer dans ce terminal, <i>app.js</i> appelera les commandes correspondentes. Ces commandes sont repertoriées dans le dossier <b>commands</b>. Ces commandes prennent un ou plusieurs paramètres, optionnel ou obligatoire. Nous reparlerons des commandes disponibles dans la section suivante.
Le dossier <b>configs</b> quant à lui contient un dossier <b>templates</b> qui reprend tous les fichiers nécessaires lors de la création d'un nouveau projet. A la racine du dossier on retrouve aussi <i>defaultFiter.js</i> qui est le fichier par défaut ajouter à un projet via la commande add_step. 
Chaque nouveau projet est crée dans le dossier <b>projects</b> avec les fichiers de configs précedent.
On retrouve également les fichiers propres à l'environnement nodejs, et un .gitignore.

<br>
Voici l'arborescence du framework :

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
Tout d'abord, pour executer les différentes commandes, vous devez installer toutes les dépedances necessaire au bon fonctionnement de ce framework. Pour cela, executer simplement la commande npm install ppft -g (necessite la pré-installation de node sur votre machine).

Voici la liste des différentes commandes que propose le framework :

<br>

<b>Initier un nouveau projet</b>
> ppft new < projectName >

Description: Créé l'arborescence projet avec un
fichier de configuration vierge, et
éventuellement un template de
filter de type hello world.

Alias: n

Paramètres: 
- nom du projet (obligatoire)

<b>Ajouter un filtre</b>
> ppft add_filter < filterName > < projectName >

Description: Créé un nouveau filter dans un
projet existant.

Alias: af

Paramètres: 
- nom du filtre (obligatoire)
- nom du projet (facultative via choose_project commande)

<b>Supprimer un filtre</b>
> ppft del_filter < filterName > < projectName >

Description: Supprimer un filter existant. Suppression possible si le filtre n'est pas spécifier dans le <i>config-filters.json</i> du projet en question.

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
- id de l'étape suviante (facultative)
- nom du projet (facultative via choose_project commande)

<b>Supprimer un filtre</b>
> ppft del_filter < filterName > < projectName >

Description: Supprimer un filter existant. Suppression possible si le filtre n'est pas spécifier dans le <i>config-filters.json</i> du projet en question.

Alias: df

Paramètres: 
- nom du filtre (obligatoire)
- nom du projet (facultative via choose_project commande)

<b>Supprimer une étape du fichier de configuration</b>
> ppft del_step < idStep > < projectName >

Description: Supprime une step du fichier de configuration <i>config-filters.json</i>.
<b>Attention ! Les étapes orphelines ne seront pas supprimer.</b>

Alias: ds

Paramètres: 
- id de l'étape (obligatoire)
- nom du projet (facultative via choose_project commande)

<b>Choisir un dossier de travail</b>
> ppft choose_project < projectName >

Description: Afin de ne pas avoir à indiquer le nom du projet dans lequel vous executer toutes ces commandes, vous pouvez spécifier un nom de projet depuis cette commande.

Alias: cp

Paramètres: 
- nom du projet (obligatoire)


<br>

<b>Les alias</b>
<br>

Pour gagner du temps vous pouvez utilisez les alias de la façon suivante:
Pour ajouter un filtre :

<br>

> ppft as 10 capitalize 15

## API

Lors de la création d'un nouveau projet à partir de ce framework, seront générés un ensemble de fichier. Le fichier <i>app.js</i> est l'entrée du script et ne nécessite aucun ajustement (c'est à vos risques et périls). Ce fichier va lire le <i>config-filters.json</i>, autre fichier important et nous y reviendrons juste après. Le <i>app.js</i> fait appel par le biais de worker chacun des filtres. 

<br>
Le fichier <i>config-filters.json</i> contient un objet "steps" où les différentes étapes de chaque filtre doivent être lister. Il se présente de la sorte :

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

Chaque étape contient un objet avec un attribut **filter**, obligatoire, qui se référe au nom du filtre présent dans le dossier filters. Ainsi qu'un attribut **params**, un array obligatoire, pouvant être vide et qui prend des paramètres qui seront ensuite accessible dans le script du filtre en question. Aussi, l'object **next** est un array, facultative, qui spécifie le prochain filtre à être executé à la suite de celui-ci. Plusieurs filtre peuvent être spécifier dans cet array et chaque filtre appelé reprendront le resultat du filtre actuel.

<br>
Pour manipuler les filtres et les données, rien de compliquer. Les paramètres peuvent être acceder par l'intermédiaire de l'array <b>workerData</b>. Et chaque filtre doit obligatoirement retourner un message au thread parent via l'intermédiaire de parentPort.postMessage(<i> < contenu > </i>). Pour rejeter une erreur, vous pouvez passer un objet erreur de la sorte, qui sera capturer par l'<i>app.js</i> 

<br>

```
{error: true, err: <contenu du message d'erreur>}
```

## Errors

## Tools
