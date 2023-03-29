const { mongoose } = require("mongoose");

var userSchema = mongoose.Schema({
    nickname: {type: String},
    email: {type: String},
    password: {type: String},
    number_namekoins: {type: Int8Array},
    number_transactions: {type: Int8Array}
})

const User = mongoose.model('users', userSchema);