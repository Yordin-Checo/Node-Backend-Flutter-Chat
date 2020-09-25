const express = require("express");
const path = require("path");
//Esto sirve para obtener el puer dinamicamente desde el servidor
require("dotenv").config();

//DB config
require("./database/config").dbConnection();

//App de Express
const app = express();

//Lectura de una petición HTTP lo que viene en el body se pone para leerlo
app.use(express.json());

//Node Server para el socket
const server = require("http").createServer(app);
module.exports.io = require("socket.io")(server);
require("./sockets/sockets");

//Path público
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//Definición de las rutas del URL

app.use("/api/login", require("./routes/auth"));

server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);

  console.log("Servidor corriendo en puerto", process.env.PORT);
});
