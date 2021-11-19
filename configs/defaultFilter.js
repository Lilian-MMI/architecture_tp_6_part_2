// input is an array with params from config-filters.json
module.exports = (input) => {
  try {
    return input[0];
  } catch (err) {
    // if there is an error, return the error message
    throw new Error("Erreur inattendue");
  }
};
