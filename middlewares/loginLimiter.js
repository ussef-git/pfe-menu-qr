//Ceci pour contre brute force.
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ⏳ Période de 15 minutes puis il peut se reconncter
  max: 3, // 🚨 Maximum de 3 tentatives par IP
  message: "⚠️ Trop de tentatives de connexion, veuillez réessayer plus tard !",
  headers: true,
});

module.exports = loginLimiter;
