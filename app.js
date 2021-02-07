const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mimeTypes = require("./mime-types");

const args = process.argv.slice(2);
const port = args.length ? args[0] : 3000;

const requestListener = (req, res) => {
  console.log(req.url);
  console.log(req.method);
  // const parsedURL = new URL(req.url, `http://localhost:${port}`);
  const parsedURL = url.parse(req.url, true);
  let urlPath = parsedURL.pathname;
  urlPath = urlPath.replace(/^\/+|\/+$/g, "");

  switch (urlPath) {
    case "":
      fs.readFile(__dirname + "/index1.html", (err, data) => {
        if (err) {
          res.writeHead(403, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Unable to access requested file" })
          );
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
      break;
    case "file":
      let { fileFullPath } = parsedURL.query;
      fileFullPath = fileFullPath.replace(/^\'|\'$/g, "");
      const extension = path.extname(fileFullPath);
      const fileMimeType = mimeTypes[extension] || undefined;
      if (fileMimeType === undefined) {
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Invalid file extension" }));
      }
      fs.readFile(fileFullPath, (err, data) => {
        if (err) {
          res.writeHead(403, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Unable to access requested file" })
          );
        }
        res.writeHead(200, { "Content-type": fileMimeType });
        res.end(data);
      });
      break;
    default:
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(403, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          message: "File Not Found",
          code: 404,
        })
      );
      res.end();
      break;
  }
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Local file server running on " + bind);
};

const server = http.createServer(requestListener);
server.listen(port);

server.on("error", onError);
server.on("listening", onListening);
