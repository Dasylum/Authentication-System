var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var users = require('./models/users');
var content = require('./models/UserContent');
var auth = require('./auth/auth.js');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
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
const contentschema = conn.model('Content', content.schema);

const accessTokenSecret = 'secret';

function generateJWT(user) {
	return jwt.sign({ username: user.email,  _id: user._id }, accessTokenSecret);
}


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

app.get('/', auth, function(req, res) {

	userschema.find({})
	.populate('content')
		.exec(function(err, createdUser) {
			res.json(createdUser);
		});

});


/*userschema.remove({}, function(err) { 
   console.log('collection removed') 
});*/

/*contentschema.remove({_id: "5e8c7a1da8f277248c7ae30e"}, err => {
	console.log("deleted");
})*/


app.post('/signup', (req, res) => {
	var instance = new userschema();
	instance.email = req.body.name;
	instance.salt = crypto.randomBytes(32).toString('hex');
	instance.hash = crypto.pbkdf2Sync(req.body.password, instance.salt, 10000, 64, 'sha512').toString('hex');
	instance.save((err, createdUser) => {
		if(err) return handlError(err);
		else {
			res.send((createdUser));
		}
	});
});

app.post('/login', (req, res, next) => {

	return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }
 
    if(passportUser) {
    	var token = generateJWT(passportUser);
    	return res.json(token);
    }

    return status(400).info;
  })(req, res, next);

});


app.post('/upload', auth, (req, res, next) => {
	
	const { _id } = req.user;

 	userschema.findById(_id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      var instance = new contentschema();
      instance.url.push(req.body.url);
      instance.details = req.body.details;

      instance.save((err, createdUser) => {

      	user.content.push(createdUser);
      	user.save((err) => {

      		console.log(err);

      	});
 
      		res.json(user);
      });

    });

});

app.post('/delete', (req, res, next) => {

  contentschema.remove({_id: req.body.id}, err => {

    res.send("Removed Successfully");
  })

})

app.listen(3000, () => {
	console.log("server running on port 3000...");
});