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

    console.log(req.query.date, "왜", typeof(req.query.date))
    
    var data, sum, newArray = null
    try{
        const query = {
            date: { 
                "$regex" : `${req.query.date}`, 
                "$options" : "s"
            }
        }
        const aggregation = [
            {
                '$match' : query
            },
            {
                '$group': {
                    _id: null,
                    totalWithdrawal: { $sum: '$withdrawal' },
                    totalDeposit: { $sum: '$deposit'}
                }
            }
        ];

        data = await Transcation.find(query)
        console.log(data)
        // sum = await Transcation.aggregate(aggregation)
        // console.log(data, sum)
        // const newArray = sum.concat(data);
        // console.log(newArray[0])

        // console.log(data)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}
