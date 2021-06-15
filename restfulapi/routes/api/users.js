const express=require("express");



const jwt=require("jsonwebtoken");
const config= require("config");
let router =express.Router();

let {User}= require("../../models/user");
const _ = require("lodash");

router.post("/register",async (req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("user given email already exist")
    user =new User();

    user.name= req.body.name;
    user.email= req.body.email;
    user.password = req.body.password;
    await user.genrateHashedPassword();
    await user.save();
    return res.send(_.pick(user,["name","email"]));
});

router.get("/",async (req,res)=>{
let users= await User.find();
return res.send(users);
});

router.delete("/register/:id",async (req,res)=>{
    let user = await User.findByIdAndDelete(req.params.id);
    return res.send(user);
});

router.post("/login",async(req,res)=>{
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("usernot registered");

    let isValid = await bcrypt.compare(req.body.password,user.password)
    if(!isValid) return res.status(401).send("Invalid password");
   
    let token = jwt.sign({_id:user._id,name:user.name},
                        config.get("jwtPrivateKey") );

    return res.send(token);

} )
module.exports =router; 