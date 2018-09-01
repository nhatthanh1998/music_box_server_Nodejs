import {User} from '../models/user'

    const sign_up_middleware = function check_exist_userame(req,res,next){
    return User.findOne({
        username:req.body.username
    }).then(user=>{
        if(user){
            res.status(200).send({message:"Username has been taken"})
            next()
        }
        else if(req.body.password.length <5){
            res.status(200).send({message:"password must be 5 letters or more"})
        }
        else{
            next()
        }
    })
}
module.exports = {
    sign_up_middleware
}