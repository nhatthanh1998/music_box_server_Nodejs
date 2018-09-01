import express from 'express'
import bodyParser from 'body-parser'
import {mongoose} from './db/mongoose'
import {ensure_token} from './service/middleware'
import {sign_up_middleware} from './service/signup_middle'
import {User} from './models/user'
import 'babel-polyfill'
var app = express()

app.listen(3000,()=>{
    console.log("server is start on port 3000")
})
app.use(bodyParser.json())

app.post('/create',sign_up_middleware,(req,res)=>{
    var newUser = new User({
        username:req.body.username,
        password:req.body.password,
        created_at:new Date().getTime()
    })
    newUser.generate_token()
    newUser.save()
    res.status(200).send(newUser.token)
})


app.post('/login',async (req,res)=>{
    var token = await User.login(req.body.username,req.body.password)
    res.header("x-auth",token).status(200).send(token)
})


app.post('/api/protect',ensure_token,async (req,res)=>{
    var check = await User.verify_token(req.token)
    if(check === true){
        res.status(200).send("hi,this is a top secrect api")
    }else{
        res.sendStatus(403)
    }
})