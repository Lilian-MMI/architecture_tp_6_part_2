const fs = require("fs");
const conf = new (require("conf"))();
const chalk = require("chalk");

function deleteFilter(filterName, projectName) {
  if (!projectName) {
    currentProject = conf.get("project-list").find((project) => project.active);

    if (!currentProject)
      throw new Error(
        "Veuillez spécifier en paramètre le nom du projet, ou utilser la commande choose_project."
      );

    projectName = currentProject.name;
  }

  if (!fs.existsSync(`projects/${projectName}/filters`))
    throw new Error(`Le projet ${projectName} n'existe pas.`);

  if (!fs.existsSync(`projects/${projectName}/filters/${filterName}.js`))
    throw new Error(`Le filtre ${filterName} n'existe pas.`);

  let configFilter = JSON.parse(
    fs.readFileSync(
      `${__dirname}/../projects/${projectName}/config-filters.json`,
      "utf8"
    )
  );

  const isUsedInConfig = Object.entries(configFilter.steps).filter(
    ([key, value]) => value.filter.includes(filterName)
  );

  if (isUsedInConfig.length > 0)
    throw new Error(`Le filtre ${filterName} est utilisé actuellement.`);

  fs.unlinkSync(
    `${__dirname}/../projects/${projectName}/filters/${filterName}.js`
  );

  console.log(chalk.green(`Suppresion du filtre ${filterName} avec succès.`));
}

module.exports = deleteFilter;
