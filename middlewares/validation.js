const { body } = require('express-validator');

const validateAdmin = [
  body('username').notEmpty().trim().withMessage('Le nom d\'utilisateur est requis.'),
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  body('telephone').isNumeric().withMessage('Le téléphone doit être un nombre.')
];

module.exports = { validateAdmin };