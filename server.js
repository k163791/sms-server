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
			return res.json(user[0])
			else
			return res.json(`Couldn't Signin`);
		})
		.catch(err => res.status(400).json(`Couldn't Signin`));
})

app.post('/getSecId',(req,res) => {
	db.select('id').from('sections').where('sec_name','=',req.body.sec_name)
	.then(secId => {
		res.json(secId[0]);
	}).catch(err => res.status(400).json(`Something Went Wrong`));
})

app.post('/displayPlayers',(req,res) => {
	db.select('*').from('players').where('team_id','=',req.body.team_id)
	.then(data => {
		res.json(data)
	}).catch(err => res.status(400).json(err))
})

app.post('/displayMatches',(req,res) => {
	db.select('*').from('matches').where('team1','=',req.body.id).orWhere('team2','=',req.body.id)
	.then(data => {
		res.json(data);
	}).catch(err => res.status(400).json(err));
})


app.post('/getimage',(req,res) => {
	db.select('id','tname','image').from('teams')
		.then(img => {
			// console.log(img[0]);
			res.json(img)
		})
		.catch(err => res.status(400).json(`Couldn't get image`));
})

app.post('/teams',(req,res) => {
	db.select('tname').from('teams')
		.then(team => {
			res.json(team);
		})
})

app.post('/players',(req,res) => {
	db.select('pname').from('players')
		.then(player => {
			res.json(player);
		})
		
})

app.post('/filterPlayers',(req,res) => {
	db.select('team_id').from('players').where('pname','=',req.body.pname)
	.then(result =>{
		console.log(result);
		db.select('*').from('matches').where('team1','=',result[0].team_id).orWhere('team2','=',result[0].team_id)
		.then(resp => {
			console.log(resp);
			res.json(resp)
		}).catch(err => res.status(400).json('Something Went Wrong'))
	}).catch(err => res.status(400).json('Something Went Wrong'))
})

app.post('/filterMatches',(req,res) => {
	console.log(req.body.tname);
	db.select('id').from('teams').where('tname','=',req.body.tname)
	.then(result =>{
		console.log(result);
		db.select('*').from('matches').where('team1','=',result[0].id).orWhere('team2','=',result[0].id)
		.then(resp => {
			console.log(resp);
			res.json(resp)
		}).catch(err => res.status(400).json(`Something Went Wrong`));
	}).catch(err => res.status(400).json(`Something Went Wrong`));
})


app.post('/getTickets',(req,res) => {
	db.select('id').from('users').where('email','=',req.body.email)
	.then(result => {
		console.log(result);
		db.select('*').from('tickets').where('user_id','=',result[0].id)
		.then(resp => {
			console.log(resp);
			res.json(resp);
		}).catch(err => res.status(400).json(`Something Went Wrong`));
	}).catch(err => res.status(400).json(`Something Went Wrong`));
})	

app.post('/retrieve',(req,res) => {
	db.select('*').from('users').where('email','=',req.body.email)
	.then(user => {
		res.json(user[0])
	}).catch(err => res.status(400).json(`Something Went Wrong`))
})

app.post('/matchTeams',(req,res) => {
	db.select('team1_name','team2_name').from('matches').where('id','=',req.body.id)
	.then(data => {
		console.log(data);
		res.json(data[0]);
	}).catch(err => res.status(400).json(err));
})


app.post('/leagues',(req,res)=>{
	db.select('*').from('leagues')
	.then(data => {
		console.log(data);
		res.json(data);
	}).catch(err => res.status(400).json(err))
})

app.post('/addTeam',(req,res) => {
	db('teams')
	.returning('*')
	.insert({
		tname : req.body.tname,
		country : req.body.country,
		ratings : req.body.ratings,
		createdat : new Date()
	}).then(data => {
		res.json(data);
	}).catch(err=> res.status(400).json(err))
})

	
app.post('/player',(req,res) => {
	db.select('*').from('players').where('pname','=',req.body.pname)
	.then(player => {
		res.json(player)
	}).catch(err => res.status(400).json('Something Went Wrong'))
})

app.post('/getID',(req,res) => {
	db.select('id').from('users').where('email','=',req.body.email)
	.then(userid => {
		res.json(userid[0])
	}).catch(err => res.status(400).json('Something Went Wrong'))
})


app.post('/getSections',(req,res) => {
	db.select('*').from('sections')
	.then(sect => {
		res.json(sect);
	}).catch(err => res.status(400).json(`Something Went Wrong`));
})

app.post('/getTeams',(req,res) => {
	db.select('team1_name','team2_name').from('matches').where('id','=',req.body.id)
	.then(teams => {
		res.json(teams[0]);
	}).catch(err => res.status(400).json(err));
})


app.post('/cancel',(req,res) => {
	db('tickets')
	.where('id','=',req.body.id)
	.del()
	.catch(err => res.status(400).json('Something Went Wrong'))
})

app.post('/updateProfile',(req,res) => {
	// const {name, username, email, password, age, id } = req.body;
	// req.body.age = parseInt(req.body.age,10);
	db('users')
	.returning('*')
	.where('email','=',req.body.email)
	.update({
		username : req.body.username,
		name :  req.body.name,
		email : req.body.email,
		password : req.body.password,
		age : req.body.age
	})
	.then(user => {
		console.log(user[0]);
		res.json(user[0]);
	})
	.catch(err => {
		console.log(err);
		res.status(400).json('Something Went Wrong')
	})
});


app.post('/book',(req,res) => {
	db('tickets')
	.returning('*')
	.insert({
		match_id : req.body.match_id,
		section_id : req.body.section_id,
		user_id : req.body.user_id,
		createdat : new Date()
	})
	.then(data => {
		console.log(data);
		res.json(data[0]);
	})	
	.catch(err => res.status(400).json('Something Went Wrong'));
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
		createdat : new Date()
	})
	.then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json(`Couldn't Register`))
})

app.post('/contact',(req,res) => {
	// const { name, email, message } = req.body;
	db('feedback')
	.returning('*')
	.insert({
		createdat : new Date(),
		name : req.body.name,
		email : req.body.email,
		message : req.body.message
	})
	.then(feedback => {
		console.log(feedback);
		res.json(feedback[0])
	})
	.catch(err => res.status(400).json(`Couldn't Recieve Feeback`))
})


app.listen(3001, ()=> {
	console.log('app is running on port 3001');
});

