window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eventID")) {
		event = url.get("eventID");

		getEventDetails(event)

	}
	else {
		document.body = "EVENT NOT FOUND"
	}
	
}