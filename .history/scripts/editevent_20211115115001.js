window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eventID")) {
		eventID = url.get("eventID");

		getEventDetails(event)

	}
	else {
		document.body = "EVENT NOT FOUND"
	}
	
}