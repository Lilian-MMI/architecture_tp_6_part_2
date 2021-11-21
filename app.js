#! /usr/bin/env node
const commander = require("commander");
const program = new commander.Command();
const fs = require("fs");

const createProject = require("./commands/createProject");
const createFilter = require("./commands/createFilter");
const addStep = require("./commands/addStep");
const deleteStep = require("./commands/deleteStep");
const deleteFilter = require("./commands/deleteFilter");
const chooseProject = require("./commands/chooseProject");

const chalk = require("chalk");

try {
  program
    .name("ppft")
    .command("new")
    .alias("n")
    .arguments("<name>", "Le nom du projet")
    .description(
      `Créé l'arborescence projet avec un fichier de configuration vierge, et éventuellement un template de filter de type hello world.`
    )
    .action(createProject);

  program
    .name("ppft")
    .command("add_filter")
    .alias("af")
    .arguments("<name>", "Le nom du filtre")
    .arguments("[projectName]", "Le nom du projet")
    .description(`Créé un nouveau filter dans un projet existant.`)
    .action(createFilter);

  program
    .name("ppft")
    .command("add_step")
    .alias("as")
    .arguments("<idStep>", "ID du step")
    .arguments("<filterName>", "Le nom du filtre")
    .arguments("[nextStepId]", "ID du prochain step")
    .arguments("[projectName]", "Le nom du projet")
    .description(
      `Ajoute une step au fichier de configuration. Cette commande prend les paramètres suivants : id de step unique - nom de filter - nom de projet - id step suivante (si nécessaire)`
    )
    .action(addStep);

  program
    .name("ppft")
    .command("del_step")
    .alias("ds")
    .arguments("<idStep>", "ID du step")
    .arguments("[projectName]", "Le nom du projet")
    .description(
      `Supprime une step du fichier de configuration. Cette commande prend les paramètres suivants : - id de step unique. - nom du projet.`
    )
    .action(deleteStep);

  program
    .name("ppft")
    .command("del_filter")
    .alias("df")
    .arguments("<filterName>", "Le nom du filtre")
    .arguments("[projectName]", "Le nom du projet")
    .description(`Supprimer un filter existant.`)
    .action(deleteFilter);

  program
    .name("ppft")
    .command("choose_project")
    .alias("cp")
    .addArgument(
      new commander.Argument("<projectName>", "Le nom du projet").choices(
        fs.readdirSync("projects")
      )
    )
    .description(`Se positionne sur un projet.`)
    .action(chooseProject);

  program.showHelpAfterError();
  program.parse();
} catch (error) {
  console.log(chalk.red(error.message));
}
