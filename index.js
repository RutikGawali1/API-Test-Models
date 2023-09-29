const express = require('express')
var bodyParser = require('body-parser')
require('./models/index')
var userCtrl = require('./controllers/userController')


//const User = require('./models/user'); 
//const Contact =require('./models/contact')
const app = express()

app.use(bodyParser.json())


app.get('/', function(req, res) {
    res.send('Hello World')
})

//creating route
app.get('/add',  userCtrl.addUser)

app.get('/users', userCtrl.getUsers)

app.get('/users/:id', userCtrl.getUser)

app.post('/users', userCtrl.postUsers)

app.delete('/users/:id', userCtrl.deleteUser)

app.patch('/users/:id', userCtrl.patchUser)

app.get('/finders', userCtrl.findersUser)

app.get('/get-set-virtual', userCtrl.getSetVirtualUser)

app.get('/validate',userCtrl.validateUser)

app.get('/raw-queries', userCtrl.rawQueriesUser)

app.get('/one-to-one', userCtrl.oneToOneUser)

app.get('/one-to-many', userCtrl.oneToManyUser)

app.get('/many-to-many', userCtrl.manyToManyUser)

app.get('/paranoid', userCtrl.paranoidUser)

app.get('/loading', userCtrl.loadingUser)

app.get('/eager',userCtrl.eagerUser)

app.get('/creator',userCtrl.creatorUser)

app.get('/m-n-associations',userCtrl.mnAssociationsUser)

app.get('/m2m2m',userCtrl.m2m2mUser)

app.get('/scopes',userCtrl.scopeUser)

app.get('/transactions',userCtrl.transactionsUser)

app.get('/hooks',userCtrl.hooksUser)

app.get('/polyOneTwoMany',userCtrl.polyOneTwoManyUsers)

app.get('/polyManyToMany',userCtrl.polyManyToManyUsers)

app.get('/query-interface',userCtrl.queryinterfaceUsers)

app.get('/sub-query',userCtrl.subQueryUsers)
//User.sync({ force: true });
//User.drop();
//Contact.sync({force:true})

app.listen(3000,() => {
    console.log('App will run on: http://localhost:3000')
})