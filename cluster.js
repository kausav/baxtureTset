const cluster = require("cluster");
const os = require("os");
const http = require("http");

const PORT = 4000;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length - 1; // Number of available parallelism - 1

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker process exits
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Your server setup code here
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Worker ${process.pid} handling request`);
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
