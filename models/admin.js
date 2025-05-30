const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    telephone: { 
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    authTokens: [{ 
        type: String,
        required: true,
    }],
    verificationMethod: {
        type: String,
        enum: ["email", "sms"],
       required:true,
    },
    otp:{
        type:String,
    },
    otpExpires:{
        type:Date,
    }
});

// Méthode pour générer et stocker un token d'authentification
adminSchema.methods.generateAuthTokenAndSaveAdmin = async function() {
    const authToken = jwt.sign({ _id: this._id.toString() }, 'foo');
    this.authTokens.push(authToken); // Utilisation correcte d'un tableau
    await this.save();
    return authToken;
};

// Hash du mot de passe avant la sauvegarde
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour comparer les mots de passe
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;