var async = require('async');

var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var buttons;
var connection = mysql.createConnection(credentials); // setup the connection
sql = "select * from institutional_casey.till_buttons;"


connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
  var sql = 'SELECT * FROM institutional_casey.till_buttons';
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});

app.get("/click",function(req,res){
  	var id = req.param('id');
  	var sql = 'SELECT price from institutional_casey.prices where id = '+id;
  	var item_price;

	console.log("Attempting sql ->"+sql+"<-");

	async.series([
		function(callback){
			connection.query(sql,(function(res){
				return function(err,rows,fields){
    				if(err){
				console.log("We have an insertion error:");
        	     		console.log(err);
				}
    	 			res.send(err); // Let the upstream guy know how it went
				item_price = rows[0];
	 }})(res));	
	 callback();}]);
});
app.get("/prices",function(req,res){
	var sql = "select * from institutional_casey.prices";	
  connection.query(sql,(function(res){return function(err,rows,fields){
	  if(err){console.log("We have an error");
		  console.log(err);}
	  res.send(rows);
  }})(res));
});



app.get("/user",function(req,res){
	var userID = req.param('userID');
	var sql = 'SELECT * FROM institutional_casey.users where userID = '+userID;
	connection.query(sql,(function(res){return function(err,rows,fields){
		if(err){console.log("We have an error:");
			console.log(err);}
		res.send(rows);
	}})(res));

});


//app.get("/click",function(req,res){
 // var id = req.param('id');
 // var sql = ''
  //console.log("Attempting sql ->"+sql+"<-");

  //connection.query(sql,(function(res){return function(err,rows,fields){
     //if(err){console.log("We have an insertion error:");
      //       console.log(err);}
    // res.send(err); // Let the upstream guy know how it went
  //}})(res));
//});

// Your other API handlers go here!
// app.get("/changeUser",function(req,res){
//	var sql = "select * from institutional_casey.users"	
 // connection.query(sql,(function(res){return function(err,rows,fields){	  
    // if(err){console.log("We have an error:");
  //           console.log(err);}
//	  res.send(rows);
  // }})(res));
// });
// app.get("/delete", function(req,res){
//	var ID = req.param('id');
//	var sql = 'Delete from institutional_casey.current_transaction where ID =' + ID;

//}
app.listen(port);
