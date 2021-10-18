const users = [
	{
		id: '0', 
		name: 'me', 
		role: 'student'
	}
]

function loadUser(req, res, next) {
	 console.log(req);
}

module.exports = loadUser;