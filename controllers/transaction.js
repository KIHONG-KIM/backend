const Transcation = require("../models/transaction");


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
        console.log(data[0])
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 수정하기 ("미분류" => 자동 수정)
exports.postTransactionUpadate = (req,res)=>{

    console.log("### BACKEND post /transactionUpdate, updateOne ###")
    console.log("Trying to updateOne data")


    var data = null;
    for ( var i = 0 ; i < req.body.length ; i ++) {
        try {
            const updateOne = Transcation.updateOne(
                { title: data.title }, 
                { $set : 
                    { category: data.category } 
                })
        } catch (err) {
            console.log(err)
        }
    }
    console.log ("### FINISH ###")

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

// 일정 읽어오기 (READ for Calendar)
exports.test = async (req,res)=>{

    var data = null;
    var 날짜 = "2024.01"
    try{
        const query = {
            date: { 
                "$regex" : 날짜, 
                "$options" : "s"
            }
        }

        data = await Transcation.find(query)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}
