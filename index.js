var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var users = require('./models/users');
var auth = require('./auth/auth.js');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(flash());
app.use(bodyParser.json());
app.use(express.static('public'));

var url = "mongodb://localhost:27017/newdb";

const conn = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userschema = conn.model('userModel', users.schema);

const accessTokenSecret = 'secret';

function generateJWT(user) {
	return jwt.sign({ username: user.email,  _id: user._id }, accessTokenSecret);
}


/*function toAuthJSON(user) {
	return {
		_id: user._id,
		email: user.email,
		token: generateJWT(user)
	}
}
*/

function ValidPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

passport.use(new LocalStrategy(

	function(username, password, done) {
		
		userschema.findOne({email: username}, function (err, user) {
			
			if (err) {return done(err);}

			if(!user) {
				return done(null, false, {message: "Incorrect username"});
			}
			const isValid = ValidPassword(password, user.hash, user.salt);

			 if (isValid) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch((err) => {   
                done(err);
            });
	}
));

app.use(passport.initialize());
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.get('/', function(req, res) {

	userschema.find()
	.then(user => {
		res.send(user);
	})
})


app.post('/SignUp', auth, (req, res) => {
	var instance = new userschema();
	instance.email = req.body.name;
	instance.salt = crypto.randomBytes(32).toString('hex');
	instance.hash = crypto.pbkdf2Sync(req.body.password, instance.salt, 10000, 64, 'sha512').toString('hex');
	instance.save((err, createdUser) => {
		if(err) return handlError(err);
		else {
			res.send(generateJWT(createdUser));
		}
	})
})

app.post('/login', auth, (req, res, next) => {

	 return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }
 
    if(passportUser) {
      	return res.json(generateJWT(passportUser));
    }

    return status(400).info;
  })(req, res, next);
});


app.get('/current', auth, (req, res, next) => {
	
	const { _id } = req.user;

	console.log(_id);

 	return userschema.findById(_id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json("Welcome " + user.email);
    });
	
});

app.listen(3000, () => {
	console.log("server running on port 3000...");
});