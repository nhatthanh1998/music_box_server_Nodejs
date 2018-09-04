import {ensure_token} from '../service/middleware'
import {User} from '../models/user'
import "babel-polyfill"
const UserRoute = function (app) {

  app.post('/login', async(req, res) => {
    var token = await User.login(req.body.username, req.body.password)
    res
      .status(200)
      .send(token)
  })

  app.post('/create', (req, res) => {
    return User
      .findOne({username: req.body.username})
      .then(user => {
        if (user) {
          res
            .status(200)
            .send("username has been taken")
        } else {
          if (req.body.password.length < 5 || !req.body.password) {
            res
              .status(200)
              .send("password required")
          }
          var display_name=''
          if(req.body.display_name){
            display_name = req.body.display_name
          }else{
            display_name = req.body.username + Math.random(10, 100)
          }
          var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            display_name: display_name
          })

          newUser.created_at = new Date().getTime()
          newUser.generate_token()
          newUser.save()
          res
            .status(200)
            .send(null)
        }
      })
  })

  app.get('/current_user', ensure_token, async(req, res) => {
    var check = await User.verify_token(req.token)
    if (check === true) {
      var user = User.decode_token(req.token)
      res
        .status(200)
        .send({user:user})
    } else {
      res
        .sendStatus(200)
        .send({user:null})
    }
  })
}

module.exports = {
  UserRoute
}
