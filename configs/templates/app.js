const fs = require("fs");
const steps = require("./config-filters.json").steps;
const filtersFolder = "./filters/";
const { Worker } = require("worker_threads");
const chalk = require("chalk");

try {
  // generate random number between params
  const randomBetween = (min, max) =>
    min + Math.floor(Math.random() * (max - min + 1));

  const callFilter = (filter, key, ...args) => {
    return new Promise((resolve, reject) => {
      // check if filter exists else throw error
      const isFilterValid = fs
        .readdirSync(filtersFolder)
        .find((file) => file === filter.filter);

      if (!isFilterValid)
        reject(new Error(`Ce ${filter.filter} n'est pas valide`));

      // check if next step exists else throw error
      if (steps[filter.next] === "undefined")
        reject(new Error(`${filter.filter} appelle une étape invalide `));

      // check if next step is not the current step else throw error
      if (filter.next == key)
        reject(
          new Error(`${filter.filter} ne peut pas s'appeler elle-même en next`)
        );

      // create a worker thread with the filter params and the previous step result
      const worker = new Worker(`./filters/${filter.filter}`, {
        workerData: filter.params.concat(args),
      });

      // generate r g b values between 0 and 255 to create a random color
      const r = randomBetween(0, 255);
      const g = randomBetween(0, 255);
      const b = randomBetween(0, 255);

      // when the worker thread is ready...
      worker.on("online", () => {
        console.log(
          chalk.rgb(r, g, b)(`[${key}] Starting ${filter.filter} ...`)
        );
      });

      // when the worker thread is done...
      worker.on("message", (messageFromWorker) => {
        if (messageFromWorker.error) reject(messageFromWorker.err);

        console.log(chalk.rgb(r, g, b)(`[${key}] Finished ${filter.filter}.`));
        resolve(messageFromWorker);
      });

      // when the worker encounter an error...
      worker.on("error", (err) => reject);

      // when the worker thread is killed...
      worker.on("exit", (code) => {
        if (code !== 0) reject(`Arret inattendu du filtre ${filter.filter}`);
      });
    });
  };

  // call filter & next step recursively
  const callNextSteps = async (stepObject, key, ...args) => {
    if (!stepObject.next) return callFilter(stepObject, Number(key), ...args);

    stepObject.next.forEach((nextStep) => {
      callFilter(stepObject, Number(key), ...args).then((result) =>
        callNextSteps(steps[nextStep], key, result)
      );
    });
  };

  // starting point
  const launchFilters = async () => {
    // get all steps callings by the next property
    const nextSteps = Object.entries(steps)
      .filter(([key, value]) => value.next)
      .flatMap(([key, value]) => value.next);

    Object.entries(steps).forEach(([key, step]) => {
      // if the current step is not a next step (because next step need to get the result of the previous step)
      // == current step is a starting point
      if (!nextSteps.includes(key)) {
        if (!step.next) return callFilter(step, Number(key));

        // execute the current step filter & the next step filter recursively with the result of the previous step
        callFilter(step, Number(key)).then((result) =>
          step.next.forEach((nextStep) => {
            callNextSteps(steps[nextStep], key, result);
          })
        );
      }
    });
  };

  launchFilters();
} catch (err) {
  console.log(err);
}
