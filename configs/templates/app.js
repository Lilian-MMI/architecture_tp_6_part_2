const fs = require("fs");
const steps = require("./config-filters.json").steps;
const filtersFolder = "./filters/";

try {
  const callFilter = (filter, key, ...args) => {
    // check if filter exists else throw error
    const isFilterValid = fs
      .readdirSync(filtersFolder)
      .find((file) => file === filter.filter);

    if (!isFilterValid) throw new Error(`Ce ${filter.filter} n'est pas valide`);

    // check if next step exists else throw error
    if (steps[filter.next] === "undefined")
      throw new Error(`${filter.filter} appelle une étape invalide `);

    // import the filter
    const filterImported = require(`./filters/${filter.filter}`);

    // check if filter imported is a function else throw error
    if (typeof filterImported !== "function")
      throw new Error(`${filter.filter} n'est pas une fonction`);

    // check if next step is not the current step else throw error
    if (filter.next == key)
      throw new Error(
        `${filter.filter} ne peut pas s'appeler elle-même en next`
      );

    // concat args with filter params from config-filters.json
    const result = filterImported(filter.params.concat(args));
    console.log(`Filtre ${filter.filter} terminé`);

    // if next step is not undefined, call next key step with result of current filter
    if (filter.next) {
      callFilter(steps[filter.next], key + 1, result);

      // else call the key step after the current filter withtout last filter result
    } else {
      if (key === Object.keys(steps).length) return;
      callFilter(steps[`${key + 1}`], key + 1);
    }
  };

  callFilter(steps["1"], 1);
} catch (err) {
  console.log(err.message);
}

// switch (args[0]) {
//   case "read":
//     const fileReaded = read(args[1]);
//     console.log(fileReaded);
//     break;

//   case "write":
//     const fileWrited = write(args[1], args[2]);
//     console.log(fileWrited);
//     break;

//   case "reverse":
//     const textReversed = reverse(args[1]);
//     console.log(textReversed);
//     break;

//   default:
//     console.group("Liste des fonctions :");
//     fs.readdirSync(filtersFolder).forEach((file) => {
//       console.log("-", file.split(".")[0]);
//     });
//     console.groupEnd();
// }
