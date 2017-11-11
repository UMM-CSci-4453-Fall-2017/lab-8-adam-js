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
	  buttons=rows;
     res.send(rows);
  }})(res));
});

app.get("/click",function(req,res){
  	var id = req.param('id');
	fixed_index_id = id-1;
	var label = buttons[fixed_index_id].label;
        var item_price = prices[fixed_index_id].price;
  	var sql = 'insert into institutional_casey.current_transaction (label,price) values ("' + label +'",' + item_price +  ');';

	console.log("Attempting sql ->"+sql+"<-");
	
	connection.query(sql,(function(res){return function(err,rows,fields){
		if(err){console.log("We have an error:");
			console.log(err);
		}
	}}));
});
app.get("/prices",function(req,res){
	var sql = "select * from institutional_casey.prices";	
  connection.query(sql,(function(res){return function(err,rows,fields){
	  if(err){console.log("We have an error");
		  console.log(err);}
	  prices = rows;
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

//app.get("/delete"),function(req,res){





app.get("/removeItem/:id", function(req,res){
  var resp = {};
  resp.message = "Testing things in resp";
  var id = req.params.id;
  var sql = 'DELETE FROM institutional_casey.current_transaction where id = ' + id;
  console.log("Attempting sql ->" + sql + "<-");

 connection.query(sql,(function(res){
    return function(err,rows,fields){
     if(err){
       resp.err = err;
       console.log("We have a problem");
       console.log(err);
     }
     res.send(resp);
  }})(res));
});

app.listen(port);
