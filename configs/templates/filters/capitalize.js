module.exports = (input) => {
  try {
    if (!input[0]) throw new Error("Veuillez saisir un texte à inverser");

    return input[0].toUpperCase();
  } catch (err) {
    if (!input[0]) throw new Error("Veuillez saisir un texte à inverser");
    throw new Error("Erreur inattendue");
  }
};
