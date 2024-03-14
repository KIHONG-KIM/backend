const { Schema, model } = require("mongoose");

const keyword = new Schema({
    category: { type : String },
    word: { type : String, unique: true },
    }, 
    { 
        versionKey: false,
        index: true
    } // option
); 

keyword.index({ word: 1});
module.exports = model('Keyword', keyword);