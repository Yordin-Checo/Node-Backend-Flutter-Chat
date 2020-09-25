const { JsonWebTokenError } = require("jsonwebtoken");

const jwt = require("jsonwebtoken");

const generarJWT = (uid) => {
  return new Promise((resolver, reject) => {
    const payload = {
      uid,
    };
    //para firmarlo
    jwt.sign(
      payload,
      process.env.JWT_KEY,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          //No se pude generar el token
          reject('No se pudo generar el JWT')
        } else {
          //envio el token
          resolver(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
