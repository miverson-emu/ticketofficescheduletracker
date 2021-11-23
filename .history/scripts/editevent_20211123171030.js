window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eventID")) {
		eventID = url.get("eventID");
		console.log(eventID)
		getEventDetails(eventID)
		.then((event) => {
			if(event) {
				addEventCategories()
				.then(() => {
					// set category
					[...document.getElementsByName("category")][0].value = event["category"].toUpperCase()
					addSubcategoryOptions(document.getElementById("subcategory"),event["category"])
				})
				.then(() => {
					//set subcat
					console.log(event["subcategory"]);
					[...document.getElementsByName("subcategory")][0].value = event["subcategory"].toUpperCase()
					setIDPrefix()
				})
				.then(() => {
					//set date 
					var [mm, dd, yyyy] = event["date"].split("/");
					[...document.getElementsByName("date")][0].value = yyyy + "-" + mm + "-" + dd;

					//set id
					[...document.getElementsByName("id")][0].value = event["id"].substring(2)

					Object.keys(event).forEach((key) => {
						try{
							if(!["category", "subcategory", "date", "id"].includes(key)){
								[...document.getElementsByName(key)][0].value = event[key]
								console.log(event[key])
							}	
						}
						catch(e){
							console.log("Element Not Found!")
						}
					})
				})
			}
			else 
			{
				document.body.innerHTML = "<h1>EVENT NOT FOUND</h1>"
			}
		})
	}
	else {
		document.body.innerHTML = "<h1>EVENT NOT FOUND</h1>"
	}	
}

function addEventCategories() {
	// getEventCategories()
	return getJSON("data/util.json").then((resources) => {
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
					document.getElementById("prefix").innerHTML = $("#subcategory").find("option:selected").attr("id-prefix");
					document.getElementById("id").disabled = false;
				}
			}
		}
	})
}

function addSubcategoryOptions(subcategorySelector, selectedCategory){
	getJSON("data/util.json").then((resources) => {
		eventCategories = resources.eventCategories;

		subcategories = eventCategories.find(category => category.category == selectedCategory).subcategories
		console.log(subcategories)
	
		subcategories.forEach((subcategory) => {
			subcategorySelector.innerHTML+= selectorOption(subcategory.name, {id: subcategory.id})
		})
	})
}


function setIDPrefix(){
	document.getElementById("prefix").innerHTML = $("#subcategory").find("option:selected").attr("prefix");
}

function selectorOption(value, ...attributes){
	attributesHTML = ""
	attributes.forEach((attribute) => {
		attributesHTML+=" id-prefix='" + attribute.id + "' "
	})
	// if(attributesHTML) console.log(attributesHTML)

	return "<option value ='" + value + "'" + attributesHTML + ">" + value + "</option>";
}

//populate selectors
//set id
//parse times