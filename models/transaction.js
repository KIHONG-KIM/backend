const { Schema, model } = require("mongoose");

const transaction = new Schema({
    date: { type: String },
    summary:{ type:String },    
    person:{ type:String },
    memo:{ type:String },
    withdrawal:{ type:Number },
    deposit:{ type:Number },
    balance:{ type:Number },
    place:{ type:String },
    etc:{ type:String },
},
    { versionKey: false } // option
);

module.exports = model('Transaction', transaction);