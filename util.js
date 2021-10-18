const fs = require('fs')

//DOCUMENTS
function getJSON(path) {
	return JSON.parse(fs.readFileSync(path, "utf8"))
}

function authorize(signin){

	//GET USERS FROM FILE

	const user_info = 	getJSON("./data/students.json");
	console.log("INFO: ", user_info);

	console.log("Authorizing ", signin);

	authorized = user_info.find((item) => item.eid == signin.id)

	console.log("Authorized: ", authorized)

	return authorized
	
}
module.exports = authorize


module.exports = {getJSON, authorize};