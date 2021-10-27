function clearTable(view){
	table = document.getElementById('table')
	table.innerHTML = table_headers(view)
}

function fillTable(events, view){
	table = document.getElementById('table')
	events.forEach(item => {			
		table.innerHTML+= (view) ? view_table_row(item.id, item.eventTitle, item.eventType,item.eventDate, item.eventHours, item.workHours) : log_table_row(item.id, item.eventTitle, item.eventType,item.eventDate, item.eventHours, item.workHours)
	});
}

	//TABLE
	function log_table_row(eventID, eventTitle, eventType, eventDate, eventHours, workHours){		
		return "<tr>" +
			
			"<td><input type = 'checkbox' class = 'sa' id = '" + eventID + "'></td>" + 
			
			"<td>" + eventTitle + "</td>" + 
			"<td>" + eventType + "</td>" + 
			"<td>" + eventDate + "</td>" + 
			"<td>" + eventHours + "</td>" + 
			"<td>" + workHours + "</td>" + 
			"<td><div><button onclick = \"location.href = '" + appendCurrentURL("event?eventID=" + eventID) + "'\">View</button></td>" + 
		"</tr>"
	}

	function view_table_row(eventID, eventTitle, eventType, eventDate, eventHours, workHours){	
		console.log("View Table")	
		return "<tr>" +			
			"<td>" + eventTitle + "</td>" + 
			"<td>" + eventType + "</td>" + 
			"<td>" + eventDate + "</td>" + 
			"<td>" + eventHours + "</td>" + 
			"<td>" + workHours + "</td>" + 
			"<td><div><button onclick = \"location.href = '" + appendCurrentURL("event?eventID=" + eventID) + "'\">View</button></td>" + 
		"</tr>"
	}	function table_headers(view) {
		return "<tr>" + 
			(view ? "": "<th>Available</th>") + 
			"<th>eventTitle</th>" + 
			"<th>eventType</th>" + 
			"<th>eventDate</th>" + 
			"<th>eventHours</th>" + 
			"<th>workHours</th>" + 
			"<th>actions</th>" +
		"</tr>"
	}