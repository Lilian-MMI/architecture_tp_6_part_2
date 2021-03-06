const { parentPort, workerData } = require("worker_threads");

try {
  if (!workerData[0]) throw new Error("Veuillez saisir un texte à inverser");

  setTimeout(() => {
    return parentPort.postMessage(workerData[0].split(" ").reverse().join(" "));
  }, 5000);
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
