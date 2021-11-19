const fs = require("fs");
const conf = new (require("conf"))();
const chalk = require("chalk");

function deleteStep(idStep, projectName) {
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

  let configFilter = JSON.parse(
    fs.readFileSync(
      `${__dirname}/../projects/${projectName}/config-filters.json`,
      "utf8"
    )
  );

  if (!configFilter.steps[idStep])
    throw new Error(`Cet idStep (${idStep}) n'existe pas.`);

  delete configFilter.steps[idStep];

  fs.writeFileSync(
    `${__dirname}/../projects/${projectName}/config-filters.json`,
    JSON.stringify(configFilter, null, 2)
  );

  console.log(chalk.green(`Suppresion du step ${idStep} avec succès.`));
}

module.exports = deleteStep;
