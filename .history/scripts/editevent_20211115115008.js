window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eventID")) {
		eventID = url.get("eventID");

		getEventDetails(eventID)
		.then(() => {
			
		})

	}
	else {
		document.body = "EVENT NOT FOUND"
	}
	
}