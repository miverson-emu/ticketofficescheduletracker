
window.onload = () => {

	//if role == worker && eid != worker.eid
	url = (new URL(window.location)).searchParams
	if(url.has("eid")){

		getCurrentlyLoggedInUser()
		.then((eid) => {
			getUserData(eid, )
		})
		




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
	modifiedWorker = getWorkerModificationFormData()

	modify = confirm("Are you sure you want to modify this user? \n\nOriginal:\n" + printObject(JSON.parse(sessionStorage.getItem("profile")))+ "\nModified:\n" + printObject(modifiedWorker) + "")
	if(modify == true) {
		res = modifyWorkerDataInDB(modifiedWorker);
		if(res) {
			alert(res)
		}
		else {
			window.reload()
		}
	}
	else {
		location.reload()
	}
}

function removeWorker(){
	profile = JSON.parse(sessionStorage.getItem("profile"));
	remove = confirm("Are you sure you want to remove this user? \n\n" + "EID: " + profile["eid"] + "\n\n" + printObject(profile))
	if(remove == true) {
		res = removeWorkerInDB(eid)
		console.log(res)
		if(res) {
			alert(res)
		}
		else {
			window.location.href = "/admin/workers"
		}
	}
	else {
		location.reload()
	}

}

function userNotFound(){
	document.body = "<h1>User Not Found</h1>";
}

