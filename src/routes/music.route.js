import {Music} from '../models/music'
import {User} from '../models/user'
import 'babel-polyfill'
import {ensure_token} from '../service/middleware'




const MusicRoute = function(app,upload){
    app.get('/music',ensure_token,async (req,res)=>{
        var current_user = User.decode_token(req.token)
        var music = await User.findById(current_user._id).populate("musics").then(user=>user.musics)
        res.status(200).send(music)
    })
    app.post('/upload/music',ensure_token,upload.single("music"),async (req,res)=>{
        var current_user = User.decode_token(req.token)
        var music_name = req.file.originalname.split(".")[0]
        var user = await User.findById(current_user._id).then(user=>user)
        var newMusic = new Music({
            name:music_name,
            path:req.file.filename,
            user:user
        })
        user.musics.push(newMusic)
        await newMusic.save()
        await user.save()
        res.status(200).send(newMusic)
    })

    app.get('/music/:filename',(req,res)=>{
        var filename = req.params.filename
        res.sendfile(`music/${filename}`)
    })
}

module.exports = {
    MusicRoute
}