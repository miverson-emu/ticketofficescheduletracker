window.onload = () => {
	url = (new URL(window.location)).searchParams
	if (url.has("eid")) {
		viewEID = url.get("eid");

		getEventDetails()

	}
	
}