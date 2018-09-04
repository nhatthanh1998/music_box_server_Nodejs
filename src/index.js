import express from 'express'
import bodyParser from 'body-parser'
import {UserRoute} from './routes/user.route'
import { MusicRoute } from './routes/music.route'
import {mongoose} from './db/mongoose'
import multer from 'multer'
import cors from 'cors'
import 'babel-polyfill'

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './music')
  },
  filename: function (req, file, cb) {
    var name = file.originalname.split(".")[0]

    cb(null,name+ new Date().getTime()+".mp3")
  }
})
var upload = multer({
  storage:storage
})
var app = express()
app.listen(5000, () => {
  console.log("server is start on port 5000")
})
app.use(bodyParser.json())
app.use(cors())
UserRoute(app)
MusicRoute(app,upload)

module.exports = {
  storage
}