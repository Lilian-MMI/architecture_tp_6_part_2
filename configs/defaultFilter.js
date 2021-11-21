const fs = require("fs");
const { parentPort, workerData } = require("worker_threads");

try {
  // to access your parent data you can use the workerData variable
  let message = workerData[0];

  // filter code goes here
  message.toUpperCase();

  // when your filter is done, you can send the result to the main thread by using the parentPort.postMessage method
  return parentPort.postMessage(message);
} catch (err) {
  // throw custom error here
  throw new Error("Erreur inattendue");
}
