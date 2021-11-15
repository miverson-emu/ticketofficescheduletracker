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
function writeJSON(path, data) {
	console.log(Object.keys(data))
	keys = Object.keys(data).slice(1)
	keys.forEach(key => {
		getUserData(data.eid, key).then((json) => {
			console.log(json)
		})
	})
}

function writeAvailability(data, errorMessage) {
	console.log(data)
	keys = Object.keys(data).slice(1)

	return getJSON("data/workers.json").then((workerData) => {
		worker = workerData.find(worker => worker.eid == data["eid"])
		worker["eventsAvailable"] = data["eventsAvailable"]
		console.log("Modified workers.json", workerData)
		return workerData
	})
		.then((modifiedWorkerData) => {
			return write(modifiedWorkerData, "data/workers.json", "There was a problem updating your availability")
		})
}


function setSessionStorageItem(sessionStorage, key, value) {
	sessionStorage.setItem(key, toJSON(value))
}

function getSessionStorageItem(sessionStorage, key) {
	value = sessionStorage.getItem(key);

	try {
		value = JSON.parse(value);
	}
	catch (e) {
	}
	console.log("Getting Session Storage:", key, "=>", value);
	return value
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
	return getJSON("data/workers.json")
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

function write(fileContents, fileName, errorMessage){
	return $.post("../w", 
		{
			"fileContents": toJSON(fileContents), 
			"fileName": fileName, 
			"errorMessage": errorMessage
		}, 
		(res) => {
			return res
		})
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
	if(completedForm()) {

		newWorker = getWorkerModificationFormData();
		console.log(newWorker)

		add = confirm("Are you sure you want to add this user?\n\n" + printObject(worker))
		if(add == true) {
			getJSON("data/workers.json")
			.then((workers) => {

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
				
				workers.push(newWorker)
				return {
					"errors": errors, 
					"workers": workers
				}
			})
			.then((data) => {
				if(data.errors.length > 0) {
					console.log("Errors Found: " + data.errors.join(", "))
					//show errors
				}
				else {
					res = write(data.workers, "data/workers.json", "There was a problem adding this worker.")
					if(res){
						alert(res)
					}
					else{
						window.location = "/admin/workers"
					}
				}
			})
		}
	}
}



function removeWorkerInDB(eid){
	$.post("/remove", 
	{
		"db": "data/workers.json", 
		"})
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