const mongoose = require("mongoose");
const videogameModel = require("../models/videogameModel")
const ratingsModel = require("../models/ratingModel")
const reportsModel = require("../models/reportModel")
const notificationsModel = require("./notificationModel")
const rechargesModel = require("../models/rechargeModel")
const transactionsModel = require("../models/transactionModel")

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        lowercase: true,
        minlength: [3, 'El nombre de usuario debe ser superior a 3 caracteres'],
        maxlength: [20, 'El nombre de usuario debe ser inferior a 20 caracteres'],
        validate: {
            validator: function (value) {
                return value.length > 3 && value.length < 20;
            },
            message: 'El nombre de usuario debe tener más de 3 caracteres y menos de 20 caracteres.'
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'El correo electrónico es obligatorio'],
        validate: [{
            validator: function (value) {
                const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return emailRegex.test(value);
            },
            message: 'Por favor, proporciona un correo electrónico válido'
        }],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, proporciona un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    number_namekoins: { type: Number, min: 0, default: 0 },
    rol: { type: String, enum: ['Administrador', 'Usuario'], default: 'Usuario' },
    blocked: {type: Boolean, default: false},
    numReportsVideogames: {type: Number, default: 0},
    numReports: {type: Number, default: 0}
}, {
    timestamps: true
});


userSchema.pre('remove', async function(next){
    const userId = this._id;

    await videogameModel.deleteMany({userId: userId })
    await ratingsModel.deleteMany({userId: userId})
    reportsModel.deleteMany({user: userId})
    notificationsModel.deleteMany({user: userId})
    rechargesModel.deleteMany({userId: userId})
    
})
const User = mongoose.model('Users', userSchema);

module.exports = User;