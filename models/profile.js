const { Schema, model } = require("mongoose");

const profile = new Schema({
    name: { type : String },
    email: { type : String },
    contact: { type : String },
    address: { type : String },
    }, 
    { versionKey: false } // option
); 

module.exports = model('Profile', profile);