const fs = require("fs");

module.exports = (input) => {
  try {
    if (!input[0]) throw new Error("Veuillez saisir un fichier à lire");

    return fs.readFileSync(input[0], "utf8");
  } catch (err) {
    if (err.code === "ENOENT") throw new Error("Fichier introuvable");
    throw new Error("Erreur inattendue");
  }
};
