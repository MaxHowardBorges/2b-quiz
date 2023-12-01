const Docker = require('dockerode');
const fs = require('fs');
const docker = new Docker();
const numberOfRuns = 10;
const numberOfStudents = 10;

const runParallelScripts = require('./../scenarios/multiple_scenario.js');
async function measureContainerPerformance(containerId) {
  const container = docker.getContainer(containerId);

  const stats = await container.stats({ stream: false });
  const memoryUsage = stats.memory_stats.usage / 1024 / 1024; // convert to MB
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const cpuUsage = (cpuDelta / systemDelta) * 100;
  return { memoryUsage, cpuUsage };
}

// measureContainerPerformance('mariadb-prod')
//   .then((result) => {
//     console.log(`Memory usage: ${result.memoryUsage} MB`);
//     console.log(`CPU usage: ${result.cpuUsage}`);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const text = 'time,cpu usage,memory usage\n';

fs.existsSync('measures') || fs.mkdirSync('measures');
const filename =
  'measures/measure_r' + numberOfRuns + '_s' + numberOfStudents + '.csv';

fs.writeFile(filename, text, function (err) {
  if (err) throw err;
});
let time = 0;
const intervalID = setInterval(measurement, 100);

setTimeout(launchScript, 1000);

async function measurement() {
  const stats = await measureContainerPerformance('api-prod');
  time += 100;
  const line = `${time},${stats.cpuUsage},${stats.memoryUsage}\n`;
  fs.appendFile(filename, line, function (err) {
    if (err) throw err;
  });
}

async function launchScript() {
  await runParallelScripts(numberOfRuns, numberOfStudents);
  setTimeout(() => {
    clearInterval(intervalID);
    console.log('Fin des éxecutions.');
  }, 1000);
}
