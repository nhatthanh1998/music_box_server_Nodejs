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
  created_at: {
    type: Number
  },
  token: {
    type: String
  }
})



UserSchema.methods.generate_token = function(){
    var user = this
    var token = jwt.sign({
        username:user.username,
    },SERECT)
    user.token = token
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
    var check = bcrypt.compareSync(password,user.password)
    if(check === true){
      return user.token
    }else{
      return {message:"Username or password is wrong"}
    }
  })
}

const User = mongoose.model('user',UserSchema)
module.exports = {
    User
}