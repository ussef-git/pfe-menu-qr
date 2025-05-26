//Ceci pour contre brute force.
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ⏳ Période de 15 minutes
  max: 5, // 🚨 Maximum de 5 tentatives par IP
  message: "⚠️ Trop de tentatives de connexion, veuillez réessayer plus tard !",
  headers: true,
});

module.exports = loginLimiter;
