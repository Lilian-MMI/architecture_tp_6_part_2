const { parentPort, workerData } = require("worker_threads");

try {
  if (!workerData[0]) throw new Error("Veuillez saisir un texte à inverser");

  return parentPort.postMessage(workerData[0].toUpperCase());
} catch (err) {
  if (!workerData[0]) throw new Error("Veuillez saisir un texte à inverser");
  throw new Error("Erreur inattendue");
}
