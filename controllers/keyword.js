const keyword = require("../models/keyword.js");

exports.getKeywords = async (req,res) => {

    console.log("### get Keywords ###")


    try{
        

        const data = await keyword.find({})
        // const data = await keyword.insertOne({ category: "교통/통신비", word: "주차장" })
        // const data = await keyword.find( { category : "고정지출"} )
        // const data = await keyword.deleteMany( { category : "고정지출"} )


        console.log(data, "data");
        res.json(data);

    } catch (err){
        console.log("ERROR COULDN'T COMPLETE KEYWORD FIND",err);
        res.json({msg:"ERROR COULDN'T COMPLETE KEYWORD FIND",err});
    }
}

exports.postKeywords = async (req,res) => {

    console.log("### Post Keywords ###")

    // console.log(req.body)
    const cost = req.body.고정지출;
    const pre = cost.map( (element, index) => {
        return {
            category: "고정지출",
            word: element,
        }
    })
    console.log(pre)
    // const { category, word } = req.body;
    // const keyword = new Keyword(category, word); 

    try{
        const data = await keyword.insertMany( pre )

        console.log(data, "data");
        res.json({msg: "입력완료" });

    } catch (err){
        console.log("### ERROR COULDN'T COMPLETE CREATE KEYWORD ",err);
        res.json({msg:"### ERROR COULDN'T COMPLETE CREATE KEYWORD",err});
    } finally {
        
    }
}

exports.updateKeywords = async (req,res) => {

    console.log("### updateOne() Keywords ###")

    console.log(req.body, "req.body")


    try{
        const data = await keyword.updateOne({
                                                _id: req.body._id
                                            },
                                            { 
                                                $set: 
                                                { word: req.body.word,
                                                category: req.body.category }
                                            })

        console.log(data, "data");
        res.json(data);

    } catch (err){
        console.log("ERROR COULDN'T COMPLETE KEYWORD UPDATE",err);
        res.json({msg:"ERROR COULDN'T COMPLETE KEYWORD UPDATE",err});
    }
}

exports.deleteKeywords = async (req,res) => {

    console.log("### deleteOne() Keywords ###")
    const id = req.body._id;
    console.log(req.body._id, "req.body")
    try{
        const find = await keyword.find({_id: id })
        const data = await keyword.deleteOne({_id: id })
        // const data = await keyword.find( { category : "고정지출"} )
        // const data = await keyword.deleteMany( { category : "고정지출"} )

        console.log(data, "data", find, "find");
        res.json(data);

    } catch (err){
        console.log("ERROR COULDN'T COMPLETE KEYWORD DELETE",err);
        res.json({msg:"ERROR COULDN'T COMPLETE KEYWORD DELETE",err});
    }
}