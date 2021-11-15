window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eventID")) {
		viewEID = url.get("eventID");

		getEventDetails()

	}
	else {
		document.body = "EVENT NOT FOUND"
	}
	
}