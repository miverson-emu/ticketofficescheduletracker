function getJSON(path) {
	return $.get(
		"../r/getJSON?data=" + path,
		(data) => {
			return data
		})
}

function getUserData(eid, attribute) {
	return $.get(
		"../r/getJSON?data=data/workers.json",
		(data) => {
			return data
		})
		.then((data) => {
			return data.find(worker => worker.eid == eid)[attribute]
		})
}

function getCurrentUserData(attribute) {
	return getCurrentlyLoggedInUser().then((eid) => {
		return getUserData(eid, attribute)
	})
}

//incomplete?
function writeJSON(path, data) {
	console.log(Object.keys(data))
	keys = Object.keys(data).slice(1)
	keys.forEach(key => {
		getUserData(data.eid, key).then((json) => {
			console.log(json)
		})
	})
}
//test
function writeAvailability(data, errorMessage) {
	keys = Object.keys(data).slice(1)
	$.post("/writeAvailability",
	{
		"data": data, 
		"error": "There was a problem updating your availability"
	}, 
	(res) => {
		if(res) alert(res)
	})
}

function getTicketOfficeEvents() {
	return getJSON("data/events.json").then((res) => {
		return res
	})
}
function toJSON(data) {
	return (typeof data != "string") ? JSON.stringify(data, null, 4) : data;
}

function getCurrentlyLoggedInUser() {
	return $.post("/currentUser",
		(eid) => {
			return eid
		})
}

function getEventDetails(eventID) {
	return getJSON("data/events.json").then((events) => {
		return events.find(event => event.id == eventID)
	})

}

function getWorkersAvailableForEvent(eventID) {
	return $.post("/getWorkersAvailableForEvent",{}, 
	(res) => {
		if(typeof res == "object") {
			return res
		}
		else {
			alert(res)
		}
	})
}

function appendCurrentURL(add) {
	currentURL = window.location.href.split('/');

	currentURL.shift() //remove href:
	currentURL.shift() //remove ''
	currentURL.shift() //remove localhost:8000


	currentURL.pop()
	currentURL.push(add)
	console.log("/" + currentURL.join("/"))
	return "/" + currentURL.join("/")
}


// ======================= WORKER MANAGEMENT: ADD, REMOVE, MODIFY =======================
function getWorkerModificationFormData(){
	worker = {}
	inputs = [...document.getElementsByTagName("INPUT")]
	inputs.push(document.getElementsByTagName("SELECT")[0])
	inputs.forEach((input) => {
		worker[input.name] = input.value
	});
	return worker
}

function completedForm(){
	complete = true;
	inputs = [...document.getElementsByTagName("INPUT")]
	inputs.push([...document.getElementsByTagName("SELECT")][0])
	inputs.map((input) => {
		// console.log(input.name + " " + input.value)
		if (input.value == "") {
			complete = false

			error_id = input.name + "-error";
			try{
				document.getElementById(input.name + "-error").style.display = "inline-block"
			}
			catch(e) {
				console.log("Element (" + error_id + ") not found.")
			}
		}
	})
	return complete

}
function addWorker(){
	//check role == admin
	if(completedForm()) {
		newWorker = getWorkerModificationFormData();
		add = confirm("Are you sure you want to add this user?\n\n" + printObject(worker))
		if(add == true) {
			$.post("addworker", 
			{
				"newWorker": newWorker
			}, 
			(res) => {
				if(typeof res == "object"){
					res.forEach((error) => {
						document.getElementById(error).style.display = ""
					})
				}
				else if (typeof res == "string") {
					alert(res)
				}
				else {
					window.location.reload()
				}

			})
		}
	}
}


//incomplete
function removeWorkerInDB(eid){
	$.post("/remove", 
	{
		"db": "data/workers.json", 
		"key": "eid", 
		"id": eid, 
		"error": "There was a problem removing this worker. Please try again later. "
	}, 
	(res) => {
		if(res) {
			
		}
	})
}

function modifyWorkerDataInDB(formData) {

	if(completedForm()) {


		return getJSON("data/workers.json").then((workers) => {
			where = workers.findIndex(worker => worker.eid == formData["eid"]);
			workers[where] = formData;
			console.log("Modified workers.json", workers);
			return workers;
		})
			.then((modifiedWorkerData) => {
				return write(modifiedWorkerData, "data/workers.json", "There was a problem updating this user.");
			})
	}
}

function printObject(obj){
	stringObject = ""
	keys = Object.keys(obj)

	if(keys.indexOf("eventsAvailable") >= 0 ){
		keys.splice(keys.indexOf("eventsAvailable"))
	}

	keys.forEach((key) => {
		stringObject+="" + key + ": " + obj[key] + "\n"
	})
	return stringObject
}

function formatIDNumber(input, length) {
	if(input.value.length < length && input.value < (Math.pow(10, length))){
		input.value = "0" + input.value
	}
	
	else if (input.value.length >= length){
		currentValue = input.value.split("")

		if (input.value < (Math.pow(10, length))){
			while(currentValue.length > 2) {
				currentValue.shift()
			}
		}
		else {
			while(currentValue[0] == "0"){
				currentValue.shift()
			}
		}
		
		input.value = currentValue.join("")

	}
}

function populateSelector(){
	selector = document.getElementsByTagName("SELECT")[0];

	return getJSON("data/util.json")
	.then((utils) => {
		const { roles } = utils;

		roles.forEach((role) => {
			selector.innerHTML+= "<option value='" + role + "'>" + role + "</option>"
		})
	})
}