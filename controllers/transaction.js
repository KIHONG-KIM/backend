const transaction = require("../models/transaction");


// insertMany
exports.postTransaction = async (req,res)=>{
    console.log("### BACKEND post /transactions, insertMany")

    console.log("Trying to Create DB")
    try {
        const createTS = transaction.insertMany(req.body)
    } catch (err) {
        console.log(err)
    }
}

// 일정 읽어오기 (ALL)
exports.getTransactions = async (req,res)=>{
    console.log("### BACKEND get /transactions, find({})")
    
    var data = null;
    try{
        data = await transaction.find({});
        console.log('data', data);
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 읽어오기 (Category 분류에 의한)
exports.getTransactionsByCat = async (req,res)=>{
    console.log("### BACKEND get TransactionsBy`Category`, find({ category: 'category'})");

    console.log( typeof(req.query.category) );
    console.log(req.query.category);
    
    var searchOption = null;
    var data = null;
    searchOption = req.query.category;

    try{
        data = await transaction.find({ "category": searchOption })
        console.log('data', data);
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 읽어오기 (날짜 분류에 의한)
exports.getTransactionsbyDate = async (req,res)=>{
    console.log("### BACKEND get /transactionsByDate, $regex: 'YYYY.MM'")

    console.log( "날짜", req.query.date, "Type", typeof(req.query.date))
    
    var data = null;
    var 날짜 = req.query.date;  

    try{
        const query = {
            date: { 
                "$regex" : 날짜, 
                "$options" : "s"
            }
        }

        data = await transaction.find(query)
        console.log(data[0])
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 수정하기 ("미분류" => 수동 수정)
exports.postTransactionUpdate = async (req, res)=>{

    console.log("### BACKEND post /transactionUpdate, updateOne ###")
    console.log("Trying to updateOne data")
    const data = req.body;
    

        try {
            for ( var i = 0 ; i < req.body.length ; i ++) {

                console.log(data[i])
                const updateOne = await transaction.updateMany(
                    { title: data[i].title }, 
                    { $set : 
                        { category: data[i].category } 
                    })
                console.log(updateOne, "###### updateOne ######")
            }
        } catch (err) {
            console.log(err)
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

        data = await transaction.aggregate(aggregation)
        console.log(data)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

// 일정 읽어오기 (READ for Calendar)
exports.aggrBar = async (req,res)=>{

    var data = null;
    try{
        const aggregation = [
            {
                $project: {
                  month: { $substr: [ { $dateToString: { date: "$dateField", format: "%Y-%m" } }, 0, 2 ] },
                  category: "$category",
                  value: 1
                }
              }]
        
        data = await transaction.aggregate(aggregation)
        console.log(data)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}

exports.getAggrbyDate = async (req,res)=>{
    
    var data = null; // 결과값
    var 날짜 = req.query.date;  // 날짜
    console.log (날짜, "날짜")
    const query = {
        date: { 
            "$regex" : 날짜, // 날짜 데이터 바로 넘겨주기
            "$options" : "s"
        }
    }

    try{
        const aggregation = [
            {
                $facet: {
                    "category": [
                            { $match: query },            
                            { $group : {
                                _id: '$category', 
                                targets: { 
                                    '$push': '$title' 
                                },
                                Total: {
                                    '$sum': '$withdrawal'
                                },
                                count: {
                                    '$sum': 1
                                },
                                arr:{
                                    '$push': {
                                        'title': '$title',
                                        'date': '$date'
                                    } 
                                },
                                                                start: { 
                                    '$min':'$date'
                                },
                                last: {
                                    '$max': '$date'
                                }      
                            }
                        }
                    ],
                    "date": [
                        { $match: query }, 
                        {
                            $group: {
                                _id: null, 
                                start: { 
                                    '$min':'$date'
                                },
                                last: {
                                    '$max': '$date'
                                }
                            }
                        }
                    ],
                    }
                }
            ]
        
        data = await transaction.aggregate(aggregation)
        console.log(data)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }
    res.json(data)
}
