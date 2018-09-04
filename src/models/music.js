import mongoose from 'mongoose'

const MusicSchema = new mongoose.Schema({
    name:{
        type:String
    },
    path:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})

const Music = mongoose.model('music',MusicSchema)
module.exports = {
    Music
}