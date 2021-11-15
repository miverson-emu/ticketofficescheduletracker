function clearTable(view){
	table = document.getElementById('table')
	table.innerHTML = table_headers(view)
}

function fillTable(events, view){
	table = document.getElementById('table')
	events.forEach(event => {	
		// console.log(event)
		
		table.innerHTML+= (view) ? view_table_row(event) : log_table_row(event)
	});
}

	//TABLE
	function log_table_row(event){		
		return "<tr>" +
			
			"<td><input type = 'checkbox' class = 'sa' id = '" + event.id + "'></td>" + 
			
			"<td>" + event.title + "</td>" + 
			"<td>" + event.category + "</td>" + 
			"<td>" + event.subcategory + "</td>" + 
			"<td>" + event.date + "</td>" + 
			"<td>" + event.hours + "</td>" + 
			"<td>" + event.workHours + "</td>" + 
			"<td><div><button onclick = \"location.href = '" + appendCurrentURL("event?eventID=" + event.id) + "'\">View</button></td>" + 
		"</tr>"
	}

	function view_table_row(event){	
		// console.log("View Table")	
		return "<tr>" +			
		"<td>" + event.title + "</td>" + 
		"<td>" + event.category + "</td>" + 
		"<td>" + event.subcategory + "</td>" + 
		"<td>" + event.date + "</td>" + 
		"<td>" + event.hours + "</td>" + 
		"<td>" + event.workHours + "</td>" + 
			"<td><div><button onclick = \"location.href = '" + appendCurrentURL("event?eventID=" + event.id) + "'\">View</button></td>" + 
		"</tr>"
		
	}	function table_headers(view) {
		return "<tr>" + 
			(view ? "": "<th>Available</th>") + 
			"<th>Title</th>" + 
			"<th>Category</th>" + 
			"<th>Subcategory</th>" + 
			"<th>Date</th>" + 
			"<th>Hours</th>" + 
			"<th>Work Hours</th>" + 
			"<th>Actions</th>" +
		"</tr>"
	}