function getJSON(path) {
	return $.get(
		"../r/getJSON?data=" + path, 
		(data) => {
			return data
		})
}


function getWorkerData(eid, attribute){
	return $.get(
		"../r/getJSON?data=data/workers.json", 
		(data) => {
			return data
		})
		.then ((data) => {
			return data.find(worker => worker.eid == eid)[attribute]
		})	
}
function writeJSON(path, data) {
	console.log(Object.keys(data))
	keys = Object.keys(data).slice(1)
	keys.forEach(key => {
		getWorkerData(data.eid, key).then((json) => {
		console.log(json)
	})
	});
	
}

function writeAvailability(path, data, errorMessage) {
	console.log(Object.keys(data))
	keys = Object.keys(data).slice(1)
	
	return getJSON("data/workers.json").then((workerData) => {
			worker = workerData.find(worker => worker.eid == data["eid"])
			worker["eventsAvailable"] = data["eventsAvailable"]
			console.log("Modified workers.json", workerData)
			return workerData
	})
	.then((modifiedWorkerData) => {
		return $.post(
			"../w", 
			{
				"fileContents": toJSON(modifiedWorkerData), 
				"fileName": "data/workers.json", 
				"errorMessage": "There was a problem updating your availability"
			}, 
			(res) => {
				return res
			}
		)
	})
}

function setSessionStorageItem(sessionStorage, key, value){
	sessionStorage.setItem(key, toJSON(value))
}

function getSessionStorageItem(sessionStorage, key) {
	value = sessionStorage.getItem(key);

	try {
		value = JSON.parse(value);
	}
	catch(e){
	}
	console.log("Getting Session Storage:", key, "=>", value);
	return value
}

function getTicketOfficeEvents(){
	return getJSON("data/events.json").then( (res) => {
		return res
	})
}
function toJSON(data) {
	return JSON.stringify(data, null, 4)
}