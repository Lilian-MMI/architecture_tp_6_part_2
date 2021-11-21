const fs = require("fs");
const { parentPort, workerData } = require("worker_threads");

try {
  if (!workerData[0] || !workerData[1])
    throw new Error("Veuillez saisir un texte et un fichier de destination");

  fs.writeFileSync(workerData[0], workerData[1], "utf8");
  return parentPort.postMessage("File writted");
} catch (err) {
  if (!workerData[0] || !workerData[1])
    throw new Error("Veuillez saisir un texte et un fichier de destination");

  throw new Error("Erreur inattendue");
}
