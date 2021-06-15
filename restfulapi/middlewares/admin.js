function auth(res,req,next){

    if(req.user.role != "admin" )
    return res.status(403).send("You are niot authorized");
    next();
}

module.exports =admin;