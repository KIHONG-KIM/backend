const { Schema, model } = require("mongoose");

const keyword = new Schema({
    category: { type : String },
    word: { type : String },
    accuracy: { type : Number },
    }, 
    { versionKey: false } // option
); 

module.exports = model('Keyword', keyword);