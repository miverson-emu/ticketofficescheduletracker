const express = require('express');
const router = express.Router();
const User = require("../models/user.js")

//display respective web page when request is made
router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/register', (req, res) => {
	res.render('register');
})

//handle register
router.post('/register',(req,res)=>{

	const { name, email, password, password2} = req.body;
	console.log(req.body)
	let errors = []

	if (!complete([name, email, password, password2]))
		errors.push({msg: "Please complete all entries"});
	if(!passwordsMatch(password, password2))
		errors.push({msg: "Passwords do not match"});
	if(!passwordLength(password))
		errors.push({msg: "Password length min 6"})

	if(errors.length > 0 ) {
		res.render('register', errors, name, email, password, password2)
	}
	else {
		//find user with the email
		User.findOne({email: email})
		.exec((err, user) => {
			console.log(user);
			
			if (user)  {
				//if found 
				errors.push({msg: 'email already registered'});
				render(res,errors,name, email, password, password2);
			}
			else {
				//create new user
				const new_user = new User({
					name : name,
					email : email,
					password : password,
				})

				//encrypt password

            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(new_user.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        new_user.password = hash;
                    //save user
                    new_user.save()
                    .then((value)=>{
                        console.log(value)
                    res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));

			}
		})

	}
})
//handle login
router.post('/login',(req,res,next)=>{
})

//logout
router.get('/logout',(req,res)=>{
 })

module.exports  = router;


function complete(arrayOfEntries) {
	return arrayOfEntries.filter(item => item == '').length == 0
}

function passwordsMatch(p1, p2) {
	return p1 == p2;
}

function passwordLength(p){
	return p.length > 6
}