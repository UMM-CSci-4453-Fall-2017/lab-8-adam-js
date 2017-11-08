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
  // buttonID
  var btnID = req.param('id');
  var itemInfo = null;
  var itemInfoSql = 'select invID, label, price from institutional_casey.current_transaction where buttonID = ' + btnID;

  queryPromiser(DBF, itemInfoSql)
  .then(function (idResult) {
    itemInfo = idResult[0];
    var validSql = 'select exists (select invID from institutional_casey.current_transaction where invID = ' + itemInfo.invID + ') as isValid';
    return queryPromiser(DBF, validSql);
  })
  .then(function (existResult) {
    if (existResult[0].isValid) {
      // Increase amount by 1
      var updateSql = 'UPDATE institutional_casey.current_transaction SET amount = amount + 1 WHERE invID = ' + itemInfo.invID;
      return queryPromiser(DBF, updateSql);
    } else {
      // Create a new one
      var insertSql = 'insert into institutional_casey.current_transaction values (' + itemInfo.invID + ',' + 1 + ',\"' + itemInfo.label + '\",' + itemInfo.price + ')';
      return queryPromiser(DBF, insertSql);
    }
  })
  .then(function (dummy) {
    var showSql = 'select * from institutional_casey.current_transaction';
    return queryPromiser(DBF, showSql);
  })
  .then(function (currentTransaction) {
    res.send(currentTransaction);
  })
  .catch(function(err){console.log("DANGER:",err)});
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
