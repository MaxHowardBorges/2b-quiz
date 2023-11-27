const Docker = require('dockerode');
const fs = require('fs');
const docker = new Docker();
async function measureContainerPerformance(containerId) {
  const container = docker.getContainer(containerId);

  const stats = await container.stats({ stream: false });
  const memoryUsage = stats.memory_stats.usage / 1024 / 1024; // convert to MB
  const cpuUsage =
    stats.cpu_stats.cpu_usage.total_usage / stats.cpu_stats.system_cpu_usage;
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
fs.writeFile('measure.csv', text, function (err) {
  if (err) throw err;
});
let time = 0;
const intervalID = setInterval(measurement, 100);
async function measurement() {
  const stats = await measureContainerPerformance('api-prod');
  time += 100;
  const line = `${time},${stats.cpuUsage},${stats.memoryUsage}\n`;
  fs.appendFile('measure.csv', line, function (err) {
    if (err) throw err;
  });
}
