const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Vérifier la présence du token dans les headers
   const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Accès interdit, token manquant !" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérification du rôle
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Accès interdit, rôle insuffisant !" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expiré, veuillez vous reconnecter !" });
    } else {
      return res.status(401).json({ success: false, message: "Token invalide !" });
    }
  }
};

module.exports = authMiddleware;

;