const { parentPort, workerData } = require("worker_threads");

try {
  if (!workerData[0]) throw new Error("Veuillez saisir un texte à inverser");

  return parentPort.postMessage(workerData[0].toUpperCase());
} catch (err) {
  if (!workerData[0])
    return parentPort.postMessage({
      error: true,
      err: err.message,
    });

  return parentPort.postMessage({
    error: true,
    err: "Erreur inattendue",
  });
}
