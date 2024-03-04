const Profile = require("../models/profile.js");

exports.postProfile = async (req,res) => {

    console.log("/profile Post Profile")
    if (req.body === undefined ) {
        console.log("ERROR!! req.body undefined!!")
        console.log("req.body, query:", req.body, req.query)
        return null;
    }
    
    const { 
        name,
        email,
        contact,
        address,
    } = req.body;

    const profile = new Profile({
        name,
        email,
        contact,
        address,
    });

    try{

        await profile.save()
        .then((res) => {    
            console.log(res)
        })
        res.json({msg: "saved data" , id: profile});

    } catch (err){

        console.log("ERROR COULDN'T COMPLETE SCHEDULE SAVE",err);
        res.json({msg:"ERROR COULDN'T COMPLETE SCHEDULE SAVE",err});

    }
}

exports.getProfiles = async (req,res) => {

    console.log("/, get Profile")

    try{
        const data = await Profile.find({})

        console.log(data, "data");
        // res.json({msg: "saved data" , id: Profile });
        res.json(data);
    } catch (err){
        console.log("ERROR COULDN'T COMPLETE PROFILE FIND",err);
        res.json({msg:"ERROR COULDN'T COMPLETE PROFILE FIND",err});
    }
}