const { response, json } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  //verificar si existe el email

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }
    //Pasamos los datos resivido al modelo
    const usuario = new Usuario(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //mandamos a guardar la información
    await usuario.save();

    //General mi JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error de conexión",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //validar Email
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    //validar el password
    const validadPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validadPassword) {
      return res.status(404).json({
        ok: false,
        msg: "La contraseña no es valida",
      });
    }

    //Generar el JWT'
    const token = await generarJWT(usuarioDB.id);

    //Login correcto
    res.json({
      ok: true,
      usuarioDB,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error de conexión",
    });
  }
  return res.json({
    ok: true,
    msg: "Login",
  });
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  //Generar el JWT'
  const token = await generarJWT(uid);

  const usuarioDB = await Usuario.findById(uid);
  return res.json({
    ok: true,
    usuarioDB,
    token,
  });
};

module.exports = {
  crearUsuario,
  login,
  renewToken,
};
