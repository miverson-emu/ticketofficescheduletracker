// const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const ejs = require('ejs');
var bodyParser = require('body-parser') 
const cookieParser = require("cookie-parser");
var session = require('express-session');
const redis = require("redis");
const connectRedis = require("connect-redis");
// var expressLayouts = require("express-ejs-layouts")

const {authorize, encode, writeJSON, getJSON, toJSON} = require('./modules/util');


const app = express()
app.set('port', (process.env.PORT || 8000));
app.set('views', __dirname + '/views');
// app.use(expressLayouts)
// app.set('layout',  __dirname + '/layouts/base')
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

const r = express.Router();

//GATHER FORM DATA
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
  }));

app.use(cookieParser());

app.listen(app.get("port"), () => {
	console.log("App is running on http://localhost:" + app.get("port"))
})

// http://localhost:8080/ 

/* =================== SESSION MANAGEMENT  =================== */
const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
	host: "localhost", 
	port: 6379
});

redisClient.on("error", (error) => {
	console.log("Cannot connect to Redis client:\n " + error)
})

redisClient.on("connect", (error) => {
	console.log("Connect to Redis Client Successfully.")
})

  //STORER SESSION DATA
app.use(session({
	store: new RedisStore({ client: redisClient}),
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { 
		maxAge: 1000 * 60 * 10, 
		secure: false, 
		httpOnly: false
	 },
    resave: false
}));


/* =================== ROUTES =================== */
app.get(["/", "/signin"], 
(req, res) => {

	if (!req.session.eid) {

		console.log(req.session.signInError)
		// GET WORKERS
		workers = getJSON('data/workers.json')
		.map((item) => { return {
			"firstname": item.firstname, 
			"lastname": item.lastname
		}});
		
		res.render("signin", 
		{
			workers: JSON.stringify(workers, null, 2), 
			error:req.session.signInError
		});
	}
	else {
		workers = getJSON("data/workers.json")
		role = workers.find((worker) => worker.eid == req.session.eid)["role"]
		res.redirect("/" + role + "/landing")
	}
});
/* =================== MIDDLE WARE  =================== */
app.all(["/worker/*", "/admin/*"], requireLogin)

/* =================== ROUTES  =================== */

app.get("/worker/Log", 
(req, res) => {
	// console.log (session)
	res.render("log")
})
app.get(["/worker/landing","/worker/","/admin/", "/admin/landing"],  
(req, res) => {
	res.render("landing")
})

app.get(["/worker/event?", "/admin/event"],
// app.get("/event", 
(req, res) => {
	console.log("Opening event " + req.query.eventID + "...");
	res.render("eventdetails", {eventID: req.query.eventID});
})

app.get(["/admin/Events", "/worker/Events"],
(req, res) => {
// app.get("/events", (req, res) => {
	res.render("viewevents")
})

app.get("/admin/newevent", 
(req, res) => {
	res.render("newevent")
})

// /admin/workers
app.get("/admin/workers", 
(req, res) => {
	res.render("viewworkers")
})
app.get("/admin/uploadworkers", 
(req, res) => {
	res.send("In Progress: Upload csv file to add multiple workers. Display table of worker data. Edit/Remove Entries. Save.")
})

// /admin/worker
app.get(["/admin/viewworker?", "/worker/viewworker"], 
(req, res) => {
	res.render("viewprofile")
})

app.get("/admin/newworker", 
(req, res) => {
	res.render("newworker")
})

app.get("/logout", 
(req, res) => {
	req.session.destroy(error => {
		if (error) {
			console.log("Unable to logout at this time: \n" + error)
		}
		else {
			res.redirect("/")
		}	
	})
})
/* =================== FUNCTIONS  =================== */

app.post('/validate', 
(req, res) => {
	var {eid, name} = req.body;
	console.log(eid, " ", name)
	console.log(" => ", eid == "")
	console.log(" => ", eid == "E")
	console.log(" => ", name == "")
	console.log(" => ", name == null)

	if(eid == "" || eid == "E" || name == "" || name == null) {
		req.session.signInError = "Access Denied: Please select a name and enter a password"
		res.redirect("signin")
	}
	else {
		name = name.split(",").reverse().join(" ").trim()
		var user = authorize({eid, name})		

		if (!user) {
			req.session.signInError = "Access Denied: Incorrect EID"
			res.redirect("signin")
		}
		else {
			req.session.eid = user.eid;
			req.session.signInError = ""
			encodedUser = encode(user)
			res.redirect("/" + user.role + "/landing")
		}
	}
	
})

function requireLogin(req, res, next) {
	// seeRedisKeys()
	// console.log("Require Login: ", req.session.eid);
	if(req.session.eid){
		// console.log("in")
		next()
	}
	else {
		// console.log("out")
		res.redirect("/")
	}
}
app.get("/f/*",  
(req, res) => {
	path_list = req. _parsedOriginalUrl.pathname.split("/")
	file_name = path_list.pop()
	folder_name = path_list.pop()
	// console.log(file_name, folder_name);
	res.sendFile(path.join(__dirname, folder_name, file_name))
})

//GET JSON 
app.get("/r/getJSON?", 
(req, res) => {
	path_list = req. _parsedOriginalUrl.pathname.split("/")
	data = req.query.data
	res.send(getJSON(data))
});

app.post("/w", 
(req, res) => {
	const {fileName, fileContents, errorMessage} = req.body;
	fs.writeFile(fileName, toJSON(fileContents), (error) => {
		res.send((error) ? errorMessage : "File Written!");
	})
})

app.post("/currentUser", 
(req, res) => {
	console.log("Get Currently logged in user: ", req.session.eid)
	res.send(req.session.eid);
})

app.post("/makeNewEvent", 
(req, res) => {
	var { newEvent, errors } = req.body
	console.log("Make New Event: \n", newEvent)

	events = getJSON("data/events.json")

	errors.find((error) => error.title == "title").error  = Boolean(events.find(event => event.title.toUpperCase() == newEvent.title.toUpperCase()));
	errors.find((error) => error.title == "id").error  = Boolean(events.find(event => event.id == newEvent.id));

	if(errors.map(error => error.error).some(error => error == true)){
		console.log("Errors Found!")
		res.send(errors)
	}
	else {
		console.log("Creating new Event!")
		newEvent.workersAvailable = []
		events.push(newEvent)
		writeJSON("data/events.json", events)
		res.send("Success")
	}	
})

app.post("/remove", (req, res) => {
	//cannot remove self

	const { db, key, id, error } = req.body;
	workers = getJSON(db)
	// console.log("Delete ", key id)
	// console.log("Before:: ", workers)
	where = workers.findIndex(worker => worker[key] == id);

	// console.log("where=" + where + "\nworker@where: \n", workers[where])
	workers.splice(where);

	// console.log("After:: ", workers)

	fs.writeFile(db, toJSON(workers), (e) => {
		res.send((e) ? error : null);
	})
}) //remove event, remove worker

function seeRedisKeys() {
	redisClient.keys('*', function (err, keys) {
		if (err) return console.log(err);
	  
		console.log(keys)
		
	  }); 
}

app.post("/admin/addworker", 
(req, res) => {

	const { newWorker } = req.body
	workers = getJSON("data/workers.json")

	errors = []
	//existing id
	//existing email
	if(workers.find(worker => worker.email == newWorker.email)){
		console.log("Email Exists.")
		errors.push("email-exists-error")
	}
	if(workers.find(worker => worker.eid == newWorker.eid)){
		console.log("EID Exists.")

		errors.push("eid-exists-error")
	}
	newWorker.eventsAvailable = [];	
	workers.push(newWorker);
	data = {
		"errors": errors, 
		"workers": workers
	}

	if(data.errors.length > 0) {
		console.log("Errors Found: " + data.errors.join(", "))
		res.send(data.errors)
	}
	else {
		
		fs.writeFile("data/workers.json", toJSON(data.workers), (e) => {
			return (e) ? res.send("There was a problem adding this worker. Try again later.") : res.send(null);
		})
	}
})

app.post("/writeAvailability", 
(req, res) => {
	const { data, error } = req.body;

	workers = getJSON("data/workers.json");
	worker = workers.find(worker => worker.eid == data["eid"])
	worker["eventsAvailable"] = data["eventsAvailable"]
	console.log("Modified workers.json", workers)

	fs.writeFile("data/workers.json", toJSON(workers), (e) => {
		return (e) ? res.send(error) : res.send(null);
	}) 
})

app.post("/getWorkersAvailableForEvent", 
(req, res) => {
	res.send(
		adminOnly( 
			() => {
				getJSON("data/workers.json")
				.then((workers) => {
					workersAvailable = []

					workers.forEach((worker) => {
						if (worker.eventsAvailable.includes(eventID)) {
							workersAvailable.push(worker.lastname + ", " + worker.firstname)
						}
					})

					return workersAvailable
				})
			}
		)
	)
})
app.post("/modifyWorker", 
(req, res) => {
	const { formData, error } = req.body

	workers = getJSON("data/workers.json")
	where = workers.findIndex(worker => worker.eid == formData["eid"]);
	workers[where] = formData;
	console.log("Modified workers.json", workers);

	fs.writeFile("data/workers.json", toJSON(workers), (e) => {
		return (e) ? res.send(error) : res.send(null);
	}) 
})

function adminOnly(foo) {
	return getCurrentlyLoggedInUser()
	.then((eid) => {
		getUserData(eid, "role")
		.then((role) => {
			if (role == "admin"){
				foo()
			}
			else{
				return "ACCESS DENIED"
			}
		})
	})
}

