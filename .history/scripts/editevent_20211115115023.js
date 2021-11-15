window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eventID")) {
		eventID = url.get("eventID");

		getEventDetails(eventID)
		.then((event) => {
			console.log(Object.keys(event))
		})

	}
	else {
		document.body = "EVENT NOT FOUND"
	}
	
}