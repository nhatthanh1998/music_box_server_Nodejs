function ensure_token(req,res,next){
    const x_auth = req.headers["x-auth"]
    if(typeof(x_auth) !== "undefined"){
    req.token = x_auth
    next()
    }else{
        res.sendStatus(403)
    }
}

module.exports  = {
    ensure_token
}