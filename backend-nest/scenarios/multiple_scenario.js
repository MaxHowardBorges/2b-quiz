const numberOfExecutions = 5;
const scenarioFunction = require('./classic_scenario.js');

// Fonction qui exécute le script plusieurs fois en parallèle
async function runParallelScripts() {
  const scriptPromises = Array.from({ length: numberOfExecutions }, () =>
    scenarioFunction(200),
  );
  await Promise.all(scriptPromises);
  console.log('Toutes les exécutions sont terminées.');
}

// Exécute la fonction principale
runParallelScripts();
