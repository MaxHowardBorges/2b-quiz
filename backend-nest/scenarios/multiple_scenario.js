const scenarioFunction = require('./classic_scenario.js');

// Fonction qui exécute le script plusieurs fois en parallèle
module.exports = async function runParallelScripts(
  numberOfExecutions,
  numberOfStudents,
) {
  const scriptPromises = Array.from({ length: numberOfExecutions }, () =>
    scenarioFunction(numberOfStudents),
  );
  await Promise.all(scriptPromises);
  console.log('Toutes les exécutions sont terminées.');
};
