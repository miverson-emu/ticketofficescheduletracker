// const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const ejs = require('ejs');
var bodyParser = require('body-parser') 
const cookieParser = require("cookie-parser");
var session = require('express-session');
const {authorize, encode, decode, getJSON} = require('./modules/util');


const app = express()
app.set('port', (process.env.PORT || 8000));
app.set('views', __dirname + '/views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

const r = express.Router();

//GATHER FORM DATA
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
  }));

  //STORER SESSION DATA
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 1 },
    resave: false
}));

app.use(cookieParser());

app.listen(app.get("port"), () => {
	console.log("App is running on port " + app.get("port"))
})

//kill -9 $(lsof -t -i:8000)

//nodemon app.js
// http://localhost:8080/ 


/* =================== SIGN IN =================== */
app.get(["/", "/signin"], 
(req, res) => {

	if (!session.loggedIn) {
		session.loggedIn = false;

		// GET WORKERS
		workers = getJSON('data/workers.json')
		.map((item) => { return {
			"firstname": item.firstname, 
			"lastname": item.lastname
		}});
		
		res.render("signin", 
		{
			data: 'test', 
			workers: JSON.stringify(workers, null, 2)
		});
	}
	else {
		res.render("landing", {
			user : session.user
		})
	}
});
	


/* =================== VALIDATE  =================== */

app.post('/validate', 
(req, res) => {
	var {id, name} = req.body;
	// console.log("FORM:", req.body)

	//name-value: First Last
	var user = authorize({id, name});
	if(user) {

		req.session.loggedIn = true;
		req.session.userEID = user.eid;

		console.log ("Session: \n", req.session)
		encodedUser = encode(user)
		res.redirect("/user/landing?user="+ encodedUser)
	}
	else {
		req.session.loggedIn = false;

		res.render("accessnotice", 
		{
			access: "ACCESS DENIED"
		})	
	}
	session = req.session;
})


function requireLogin(req, res, next) {
	console.log("Require Login: ", session.loggedIn);
	if(session.loggedIn){
		// console.log("in")
		next()
	}
	else {
		// console.log("out")
		res.redirect("/")
	}
}

// //middle ware - require login for all routes starting with /user/
app.all(["/user/*", "/admin/*"], requireLogin)

app.get("/student/log", (req, res) => {
	console.log (session)
	res.render("log", {userEID: session.userEID})
})
app.get("/*/landing",  (req, res) => {
	console.log("User Data: ", req.query)
	res.render("landing", {
		user: req.query.user,
	})
})

app.get("/f/*",  (req, res) => {
	path_list = req. _parsedOriginalUrl.pathname.split("/")
	file_name = path_list.pop()
	folder_name = path_list.pop()
	// console.log(file_name, folder_name);
	res.sendFile(path.join(__dirname, folder_name, file_name))
})

//GET JSON 
app.get("/r/getJSON?", (req, res) => {
	path_list = req. _parsedOriginalUrl.pathname.split("/")
	data = req.query.data
	res.send(getJSON(data))
});

app.post("/w", (req, res) => {
	const {fileName, fileContents, errorMessage} = req.body;
	fs.writeFile(fileName, fileContents, (error) => {
		res.send((error) ? errorMessage : "Success! " + fileName + " updated.");
	})
})



// app.post('/signin', function (req, res) {
// 	var post = req.body;
// 	if (post.user === 'john' && post.password === 'johnspassword') {
// 	  req.session.userEID_id = johns_user_id_here;
// 	  res.redirect('/my_secret_page');
// 	} else {
// 	  res.send('Bad user/pass');
// 	}
//   });



//FUNCTIONS
function writeToFile(path, content) {
	fs.write(path, 'w')
}




