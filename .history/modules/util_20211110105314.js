const fs = require('fs')
// 
//DOCUMENTS
function getJSON(path) {
	return JSON.parse(fs.readFileSync(path, "utf8"))
}

function writeJSON(path, data) {
	fs.writeFileSync(path, JSON.stringify(data, null, 4));
}



function authorize(signin){

	//GET USERS FROM FILE
	const {eid: signInEID, name: signInName} = signin;
	const [firstname, lastname] = signInName.split(" ");
	print(firstname)
	authorized = null;

	//FIND USER ENTRY BY NAME
	userAttemptingLogin = getJSON("./data/workers.json").find(item => item.firstname === firstname && item.lastname == lastname);
	
	//CHECK IF EID MATCH
	if(userAttemptingLogin){
		authorized = (userAttemptingLogin.eid === signInEID) ? userAttemptingLogin : authorized;
		console.log("Authorized: ", authorized);
	}
	
	return authorized
}


function encode(obj) {
	return Buffer.from(JSON.stringify(obj)).toString('base64');

}

function decode(str) {
	return JSON.parse(Buffer.from(str, 'base64').toString());
}
global.exports = {getJSON}
module.exports = {getJSON, writeJSON, authorize, encode, decode};
