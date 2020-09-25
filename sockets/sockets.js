const { io } = require("../index");

//Mensaje de socket
io.on("connection", (client) => {
  console.log("Cliente conectado");

  //Emitimos las bandas cread al cliente que esta usando la aplicación

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  // client.on("mensaje", (payload) => {
  //   console.log("Mensaje!!!", payload);

  //   io.emit("mensaje", { admin: "Nuevo mensaje" });
  // });
});
