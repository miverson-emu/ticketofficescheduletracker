window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eventID")) {
		viewEID = url.get("eid");

		getEventDetails()

	}
	
}