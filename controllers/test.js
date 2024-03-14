const keyword = require("../models/keyword");
const transaction = require("../models/transaction");

// 일정 읽어오기 (READ for Calendar)
exports.test = async (req, res) => {
    var data;
    try{

        data = await keyword.insert({category:"기타",word: "꿀꿀"})

        console.log(data)
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }

    // if (data) {
        // console.log(data)
        // res.json(data)
    // }
}

// 일정 읽어오기 (READ for Calendar)
exports.testTra = async (req, res) => {

    // 일정 읽어오기 (ALL)
    console.log("### BACKEND get /transactions, find({})")

    var data = null;
    try{
        // data = await keyword.find({});
        /* index 생성하기 */

        // data = await keyword.createIndex({ word: 1 });
        // data = await transaction.find({ category: /미분류/i })

        data = await transaction.aggregate([
            {
                $match: {}
            },
            {
                $group: {
                    _id: "$category",
                    targets: { $push: "$title" },
                    count: { "$sum" : 1 } 
                  }
                },
            ])
                         
        /* 필드 중복 데이터 확인 */
        // data = await keyword.aggregate([
        //     {"$group" : 
        //         { _id: "$word",
        //         items: { $push: "$word"}, 
        //         count: { "$sum": 1 } } 
        //     },
        //     { $match: {"count" : {"$gt": 1} } }
        // ])

        /* 중복 데이터 삭제 */
        // data = await keyword.aggregate([
        //     {
        //       $group: {
        //         _id: "$word",
        //         targets: { $push: "$_id" },
        //         count: { $sum: 1 }
        //       }
        //     },])
            // {
            //     $match: { count: { $gt: 1 } }
            // }
            // ])
            // .then((docs) => {
            //     console.log(JSON.stringify(docs));
            //     var procs = [];
            //     for (var doc of docs) {                    
            //         console.log(doc, procs.length)
            //         doc.targets.shift();
            //         procs[procs.length] = keyword.deleteMany({
            //         _id: { $in: doc.targets }
            //       });
            //     }
            //     return Promise.all(procs);
            //   })
            //   .then((results) => {
            //     console.log("Remove dupulicate data.");
            // }).catch((err) => {
            //     console.log(err);
            // })

        /* 검색하기 : / / regex 사용. */
        // data = await transaction.find({ title : / /i })
        /* 존재하지 않는 필드 삭제 */
        // data = await keyword.deleteMany({ word : { $exists : false }})
        // console.log('data', data);
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }

    if (data) {
        // console.log(data)
        res.json(data)
    }
}

exports.testKey = async (req, res) => {

    // 일정 읽어오기 (ALL)
    console.log("### BACKEND get /testKeyword, aggregate({})")

    var data = null;
    try{
        // data = await keyword.find({})
        data = await keyword.aggregate([
            {
                $match: {}
            },
            {
                $group: {
                    _id: "$category",
                    words: { $push: "$word" },
                    count: { "$sum" : 1 } 
                  }
                },
            ])
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }

    if (data) {
        // console.log(data)
        res.json(data)
    }
}

exports.testDupl = async (req, res) => {

    // 일정 읽어오기 (ALL)
    console.log("### BACKEND get /testDupl, find({})")

    var data = null;
    try{

        /* 중복 데이터 확인 */
        data = await keyword.aggregate([
            {
              $group: {
                _id: "$word",
                targets: { $push: "$_id" },
                count: { $sum: 1 }
              }
            },
            {
                $match: { count: { $gt: 1 } }
            }
            ])

    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }

    if (data) {
        res.json(data)
    }
}

exports.testDel = async (req, res) => {

    // 일정 읽어오기 (ALL)
    console.log("### BACKEND get /testDel, find({})")

    var data = null;
    try{

        /* 중복 데이터 삭제 */
        data = await keyword.aggregate([
            {
              $group: {
                _id: "$word",
                targets: { $push: "$_id" },
                count: { $sum: 1 }
              }
            },
            {
                $match: { count: { $gt: 1 } }
            }
            ])
            .then((docs) => {
                console.log(JSON.stringify(docs));
                var procs = [];
                for (var doc of docs) {                    
                    console.log(doc, procs.length)
                    doc.targets.shift();
                    procs[procs.length] = keyword.deleteMany({
                    _id: { $in: doc.targets }
                  });
                }
                return Promise.all(procs);
              })
              .then((results) => {
                console.log(results , "Remove dupulicate data.");
            }).catch((err) => {
                console.log(err);
            })



    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }

    if (data) {
        res.json(data)
    }
}

exports.testDelNot = async (req, res) => {

    // 일정 읽어오기 (ALL)
    console.log("### BACKEND get /testDel, find({})")

    var data = null;
    try{
        /* 존재하지 않는 필드 삭제 */
        // data = await keyword.find({ category : { $exists : false }})
        data = await keyword.deleteMany({ word : { $exists : false }})
        console.log('data', data);
    } catch (err){
        console.log("ERROR Get 요청 실패");
        res.json({msg:"ERROR Get 요청 실패",err});
    }

    if (data) {
        res.json(data)
    }
}