const ncp = require("ncp").ncp;
const conf = new (require("conf"))();
const chalk = require("chalk");

function createProject(name) {
  let projectList = conf.get("project-list");

  if (!projectList) {
    projectList = [];
  }

  ncp("./configs/templates/", `projects/${name}`, function (err) {
    if (err) {
      return console.error(err);
    }
  });

  projectList.map((project) => {
    project.active = false;
  });

  projectList.push({ name: name, active: true });

  conf.set("project-list", projectList);

  console.log(chalk.green(`Création du projet ${name} avec succès.`));
}

module.exports = createProject;
