const fs = require("fs");
const conf = new (require("conf"))();
const chalk = require("chalk");

function createFilter(name, projectName) {
  if (!projectName) {
    currentProject = conf.get("project-list").find((project) => project.active);

    if (!currentProject)
      throw new Error(
        "Veuillez spécifier en paramètre le nom du projet, ou utilser la commande choose_project."
      );

    projectName = currentProject.name;
  }

  if (!fs.existsSync(`projects/${projectName}/filters`)) {
    throw new Error(`Le projet ${projectName} n'existe pas.`);
  }

  const defaultFilter = fs.readFileSync(
    `${__dirname}/../configs/defaultFilter.js`,
    "utf8"
  );

  fs.writeFileSync(`projects/${projectName}/filters/${name}.js`, defaultFilter);

  console.log(chalk.green(`Ajout du filtre ${name} avec succès.`));
}

module.exports = createFilter;
