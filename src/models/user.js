import mongoose, { STATES } from 'mongoose'
import {SERECT} from '../configs/serect'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  display_name:{
    type:String
  },
  created_at: {
    type: Number
  },
  token: {
    type: String
  },
  musics:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'music'
    }
  ]
})



UserSchema.methods.generate_token = function(){
    var user = this
    var token = jwt.sign({
        username:user.username,
        _id:user._id,
        created_at:new Date().getTime()
    },SERECT)
    user.token = token
}





UserSchema.statics.decode_token = function(token){
  var decoded = jwt.decode(token)
  return decoded
}

UserSchema.statics.verify_token = function(token){
    return jwt.verify(token,SERECT,(err,data)=>{
    if(err){
      return false
    }else{
      return true
    }
  })
}



UserSchema.pre("save",function(next){
  var user = this
    if(user.isModified("password")){
          bcrypt.genSalt(10,(error,salt)=>{
          bcrypt.hash(user.password,salt,(err,hashPassword)=>{
            user.password = hashPassword
            next()
          })
        })
    }else{
      next()
    }
})

UserSchema.statics.login = function(username,password){
  return User.findOne({
    username:username
  }).then(async user=>{
    if(user){
      var check = bcrypt.compareSync(password,user.password)
    if(check === true){
      return user.token
    }else{
      return {message:"Username or password is wrong"}
    }
    }else{
      return {message:"Username or password is wrong"}
    }
    
  })
}

const User = mongoose.model('user',UserSchema)
module.exports = {
    User
}