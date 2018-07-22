'use strict'
 
const hapi = require('hapi')
const loki = require('lokijs')
var data = null;

var db = new loki('mood1.json', {
	autoload: true,
	autoloadCallback : databaseInitialize,
	autosave: true, 
	autosaveInterval: 4000
});
 
const server = new hapi.Server({
  port: 3000,
  routes: {
      cors: true
  }})
 
server.route({
  method: 'POST',
  path: '/add',
  handler: (request, reply) => {
    const body = request.payload;
    
    body.id = data.length;
    data.insert(body);
    db.saveDatabase();
    console.log(body)
    console.log("User Data Length : " + data.length);
    return(`success`)
  }
})


function databaseInitialize() {
  data = db.getCollection("userEntries");
  if (data === null) {
    data = db.addCollection("userEntries");
  }
}

server.route({
  method:'GET',
  path:'/getAllItemsForUser',
  handler: (request,h) => {
    const userId = request.query.userId;
    console.log("Fetch user data with Id : " + userId);
    databaseInitialize();

    if(data) {
      const userData = { userData : data.where(item => +item.userId === +userId) };
      userData.userData.forEach(item => {
        item.id = item.$loki;
      });

      console.log("User Data " + JSON.stringify(userData));
      return userData;
    }
  }
});
 
// Start the server
async function start() {

  try {
      await server.start();
  }
  catch (err) {
      console.log(err);
      process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

start();