const fs = require('fs')
// 
//DOCUMENTS
function getJSON(path) {
	return JSON.parse(fs.readFileSync(path, "utf8"))
}

function writeJSON(path, data) {
	fs.writeFileSync(path, JSON.stringify(data));
}


function authorize(signin){

	//GET USERS FROM FILE

	const user_info = 	getJSON("./data/workers.json");
	// console.log("INFO: ", user_info);

	// console.log("Authorizing ", sIgnin);

	authorized = user_info.find((item) => item.eid == signin.id)

	console.log("Authorized: ", authorized.eid)

	return authorized
	
}


function encode(obj) {
	return Buffer.from(JSON.stringify(obj)).toString('base64');

}

function decode(str) {
	return JSON.parse(Buffer.from(str, 'base64').toString());
}
global.exports = {getJSON}
module.exports = {getJSON, authorize, encode, decode};
