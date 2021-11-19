const fs = require("fs");
const conf = new (require("conf"))();
const chalk = require("chalk");

function chooseProject(projectName) {
  let projectList = conf.get("project-list");

  if (!projectList) {
    projectList = [];
  }

  if (!fs.existsSync(`projects/${projectName}/filters`))
    throw new Error(`Le projet ${projectName} n'existe pas.`);

  projectList.map((project) => {
    project.name === projectName
      ? (project.active = true)
      : (project.active = false);
  });

  conf.set("project-list", projectList);

  console.log(
    chalk.green(`Votre environnement de travail est désormais: ${projectName}.`)
  );
}

module.exports = chooseProject;
