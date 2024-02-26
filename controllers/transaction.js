const Transcation = require("../models/transaction");
// const { connect, create, read, update, remove } = require('./../config/db');
const MongoClient = require('mongodb').MongoClient;
// const db = require('./../config/db')

exports.postTransaction = async (req,res)=>{

    console.log("Trying to Create DB", req.body[0])

    try {
        const createTS = Transcation.insertMany(req.body)

    } catch (err) {
        console.log(err)
    }

}


// 일정 읽어오기 (READ ALL)
exports.getTransactions = async (req,res)=>{
    console.log("/, get endpoint 입니다")

    var data = null
    try{
        data = await Transcation.find({})
        console.log('data', data);
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 일정 읽어오기 (READ by Date)
exports.getTransactionsbyDate = async (req,res)=>{
    console.log("/, get endpoint 입니다")
    console.log(req.query.date, "request.query.date");
    
    const query = String(`"2024.0\\${req.query.date}"`)
    console.log(typeof query, query)
    var data = null
    try{
        data = await Transcation.find({ 
            date: { 
                "$regex" : `2024.0${req.query.date}`, 
                "$options" : "s"
            }
        })
        // console.log('data', data);
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}