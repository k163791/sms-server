/* 
Bismillah
Server Side Things To-Do : 
1.SignIn
2.SignUp .. Done
3.Profile
4.Dashboard
5.Database Connection .. Done
*/

const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'uzair',
    password : 'khuljasimsim',
    database : 'sms-test'
  }
});


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/signin',(req,res) => {
	db.select('email','password').from('users')
		.where('email','=', req.body.email)
		.then(user => {
			if(user[0].password === req.body.password)
			res.json(user[0])
		})
		.catch(err => res.status(400).json(`Couldn't Signin`));
})

app.post('/getimage',(req,res) => {
	db.select('tname','image').from('teams')
		.then(img => {
			// console.log(img[0]);
			res.json(img)
		})
		.catch(err => res.status(400).json(`Couldn't get image`));
})



app.post('/register',(req,res) => {
	const { username, name, email, password, age } = req.body;
	db('users')
	.returning('*')
	.insert({
		username: username,
		name: name,
		email: email,
		password: password,
		age: age,
		createdat: new Date()
	})
	.then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json(`Couldn't Register`))
})
app.listen(3001, ()=> {
	console.log('app is running on port 3001');
});


