function formatIDNumber(input) {
	if(input.value.length < 2 && input.value < 10){
		input.value = "0" + input.value
	}
	
	else if (input.value.length >= 2){
		currentValue = input.value.split("")

		if (input.value < 10){
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

const times = [
		{
			"error": "hours-error", 
			"start": "hours-start", 
			"end": "hours-end"
		}, 
		{
			"error": "workHours-error",
			"start": "workHours-start", 
			"end": "workHours-end"
		}
	]

window.onload = () => {
	// validation()
	document.getElementById("form").onsubmit = (e) => {
		e.preventDefault()
	}
	//HIDE ERRORS ON KEY UP
	formElements = [...document.getElementById("form").elements]
	formElements.forEach((elm) => {
		["keyup", "change"].forEach((event => {
			elm.addEventListener(event, () => {
				errors = [
				elm.name + "-error", 
				elm.name + "-exists-error", 
				elm.name.split("-")[0] + "-error"
				]

				errors.forEach((error) => {
					try{
						document.getElementById(error).style.display = "none"
					}
					catch(e){
						console.log("ElementWithIDNotFound: " + error);
					}
				})
				
			})
		}))
		
	})

	// getEventCategories()
	getJSON("data/util.json").then((resources) => {
		eventCategories = resources.eventCategories;
		eventCategories = eventCategories.map(resource => resource.category)
		// console.log(eventCategories)
		
		categorySelector = document.getElementById("category")
		categorySelector.innerHTML = "<option disabled selected value = ''>-- Select an Event Category --</option>"

		//Populate Categories
		eventCategories.forEach((category) => {
			categorySelector.innerHTML+=selectorOption(category)
		})

		//Populate Subcategory on Category Selection
		categorySelector.onchange = () => {

			subcategorySelector = document.getElementById("subcategory")
			subcategorySelector.innerHTML = "<option disabled selected value = ''>-- Select an Event Category --</option>"

			if(categorySelector.value != "") {
				selectedCategory = categorySelector.value
				getJSON("data/util.json").then((resources) => {
					eventCategories = resources.eventCategories;

					subcategories = eventCategories.find(category => category.category == selectedCategory).subcategories
				
					subcategories.forEach((subcategory) => {
						subcategorySelector.innerHTML+= selectorOption(subcategory.name, {id: subcategory.id})
					})
				})
			}
		
			//SET ID PREFIX ON CHANGE
			subcategorySelector.onchange = () => {
				if(subcategorySelector.value != ""){
					document.getElementById("id-prefix").innerHTML = $("#subcategory").find("option:selected").attr("id-prefix");
					document.getElementById("id").disabled = false;
				}
			}
		}
	})
}

function selectorOption(value, ...attributes){
	attributesHTML = ""
	attributes.forEach((attribute) => {
		attributesHTML+=" id-prefix='" + attribute.id + "' "
	})
	// if(attributesHTML) console.log(attributesHTML)

	return "<option value ='" + value + "'" + attributesHTML + ">" + value + "</option>";
}

function validation(){
	console.log("Validation")
	valid = true;
	form = document.getElementById("form")
	formElements = [...form.elements]
	formElements.forEach((elm) => {
		if(elm.name) {
			if(elm.value == "") {
				valid = false;
				console.log(elm)
				document.getElementById(elm.name + "-error").style.display = "inline";
			}
			else {
				document.getElementById(elm.name + "-error").style.display = "none";
			}
		}
			
	})

	times.forEach((timePair) => {
		startTime = document.getElementById(timePair["start"]).value ? document.getElementById(timePair["start"]).value : ""
		endTime = document.getElementById(timePair["end"]).value ? document.getElementById(timePair["end"]).value : ""

		if(!validTimes(startTime, endTime)){
			valid = false
			document.getElementById(timePair["error"]).style.display = "block"
		}
	})

	form.setAttribute("valid", valid);


	if(valid){
		formData = [...form.elements];
		formData.pop() //remove submit

		formData = formData.map((input) => ({ [ input.name ]: input.value }))
		formData = Object.assign({}, ...formData)
		

		//STANDARD HOURS
		formData[ "hours" ] =  convertTimeToStardard(formData["hours-start"])  + " - " + convertTimeToStardard(formData["hours-end"]);
		formData[ "workHours" ] = convertTimeToStardard(formData["workHours-start"])  + " - " + convertTimeToStardard(formData["workHours-end"]);
		
		["hours-start", "hours-end", "workHours-start", "workHours-end"].forEach(key =>{
			delete formData[key]
		})

		//ADD PREFIX TO ID
		formData[ "id" ] = document.getElementById("id-prefix").innerHTML + formData[ "id" ]

		document.body.innerHTML+= JSON.stringify(formData)


		$.post(
			"/makeNewEvent", 
			{
				eventDetails: formData, 
				errors: [
					"title-error": {
						 "error": false,
					}

				]
			}, 
			(res) => {
				console.log(res)
			}
		)
	}
	
}

function validTimes(startTime, endTime, error){
	valid = true
	if(startTime == "" || endTime == ""){
		valid = false
	}
	else if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
		valid = false;
	}
	return valid
}


function convertTimeToStardard(timeString){
	var [hour, minute] = timeString.split(":")
	tod = "AM"

	hour = parseInt(hour)

	if (hour >= 12) tod = "PM"
	if (hour > 12) hour = hour - 12
	if (hour == 0) hour = 12

	console.log("New: ", hour, minute)

	timeString = hour + ":" + minute + " " + tod
	console.log(timeString)

	return timeString

}