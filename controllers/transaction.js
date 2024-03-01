const Transcation = require("../models/transaction");
// const { connect, create, read, update, remove } = require('./../config/db');
const MongoClient = require('mongodb').MongoClient;

// insertMany
exports.postTransaction = async (req,res)=>{
    console.log("### BACKEND post /transactions, insertMany")

    console.log("Trying to Create DB")
    try {
        const createTS = Transcation.insertMany(req.body)
    } catch (err) {
        console.log(err)
    }
}

// 일정 읽어오기 (ALL)
exports.getTransactions = async (req,res)=>{
    console.log("### BACKEND get /transactions, find({})")

    var data = null
    try{
        data = await Transcation.find({})
        // console.log('data', data);
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 일정 읽어오기 (READ by Date)
exports.getTransactionsbyDate = async (req,res)=>{
    console.log("### BACKEND get /transactionsByDate, $regex: 'YYYY.MM'")

    console.log( "날짜", req.query.date, "Type", typeof(req.query.date))
    
    var data = null;
    var 날짜 = req.query.date;  
    var newArray = null
    try{
        const query = {
            date: { 
                "$regex" : 날짜, 
                "$options" : "s"
            }
        }

        data = await Transcation.find(query)
        // console.log(data)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 일정 읽어오기 (READ for Calendar)
exports.getTransactionsCalendar = async (req,res)=>{

    console.log( "날짜", req.query.date, "Type", typeof(req.query.date))
    
    var data = null;
    var 날짜 = req.query.date;  
    var newArray = null
    try{

        const aggregation = [
            {
                '$project': {
                    _id: 1,
                    date: 1,
                    person: 1
                }
            }
        ];

        data = await Transcation.aggregate(aggregation)
        console.log(data)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}
