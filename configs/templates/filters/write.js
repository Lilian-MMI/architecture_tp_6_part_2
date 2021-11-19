const fs = require("fs");

module.exports = (input) => {
  try {
    if (!input[0] || !input[1])
      throw new Error("Veuillez saisir un texte et un fichier de destination");

    fs.writeFileSync(input[0], input[1], "utf8");
    return "File writted";
  } catch (err) {
    if (!input[0] || !input[1])
      throw new Error("Veuillez saisir un texte et un fichier de destination");

    throw new Error("Erreur inattendue");
  }
};
