const fs = require("fs");
const { parentPort, workerData } = require("worker_threads");

try {
  // to access your parent data you can use the workerData variable
  if (!workerData[0]) throw new Error("Veuillez saisir un fichier à lire");

  const file = fs.readFileSync(workerData[0], "utf8");

  // when your filter is done, you can send the result to the main thread by using the parentPort.postMessage method
  return parentPort.postMessage(file.toUpperCase());
} catch (err) {
  if (!workerData[0]) throw new Error("Fichier introuvable");
  throw new Error("Erreur inattendue");
}
