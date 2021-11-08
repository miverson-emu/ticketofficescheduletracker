
window.onload = () => {

	

	url = (new URL(window.location)).searchParams

	if(url.has("eid")){

		eid = url.get("eid");
		getJSON("data/workers.json")
		.then((workers) => {
			profile = workers.find(worker => worker.eid == eid)
			console.log(profile)

			if(!profile) {
				userNotFound()
			}
			else {

				populateSelector()
				.then(() => {
					
					sessionStorage.setItem("profile", JSON.stringify(profile))
					Object.keys(profile).forEach((key) => {
						try{
							input = document.getElementsByName(key)[0]
							if (input.tagName != "INPUT" && input.tagName!= "SELECT"){
								throw e
							}
							input.disabled = true
							input.value = profile[key]

							text = document.getElementById(key)
							if(!text) {
								throw e
							}
							text.innerHTML = profile[key];
						}
						catch(e) {
							console.log("Element not found!")
						}
					}) 
				})
			}
		})

	}
	else {
		userNotFound()
	}
}


function openEditing(elm){
	elm.innerHTML = "Submit Changes";
	elm.disabled = true;

	elm.onclick = () => {
		modifyWorker();
	}


	inputs = [...document.getElementsByTagName("INPUT")]
	inputs.push(document.getElementsByTagName("SELECT")[0])
	inputs.forEach((input) => {
		input.disabled = false;
		["keyup", "change"].forEach((event) => {
			input.addEventListener(event, () => {
				elm.disabled = false
			});
		});
	});
}

function modifyWorker() {
	worker = {}
	inputs = [...document.getElementsByTagName("INPUT")]
	inputs.push(document.getElementsByTagName("SELECT")[0])
	console.log(inputs)
	inputs.forEach((input) => {
		worker[input.name] = input.value
	});
	// console.log(printObject(worker))

	modify = confirm("Are you sure you want to modify this user? \n\nOriginal:\n" + printObject(JSON.parse(sessionStorage.getItem("profile")))+ "\nModified:\n" + printObject(worker) + "")
	if(modify == true) {
		//make request
		
	}
	else {
		location.reload()
	}
	// console.log(worker)
}

function removeWorker(){
	remove = confirm("Are you sure you want to remove this user? \n\n" + printObject(JSON.parse(sessionStorage.getItem("profile"))))
	if(modify == true) {
		//make request
	}
	else {
	}

}


function userNotFound(){
	// document.body = "User Not Found";
	alert("User Not Found!")
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