//var fs = require('fs');

var express = require('express');
var app =  express.createServer()
  , io = require('socket.io').listen(app);


//configuring express

app.configure(function(){
    app.use(express.bodyParser());
    app.use(app.router);
   // app.use(express.static(__dirname + '/images'));
});

io.set('log level', 1)




//server.register('.html', require('jade'));
var myArray = ['Face', 'LeftEye','RightEye','Mouth','Nose','Neck','Body','LeftHand','RightHand','LeftLeg','RightLeg'];
var cnt=0;

//loading home page
app.get('/', function(req, response){
fs.readFile(__dirname+'/index.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write(data);
    response.end();
	});
});


//kookoo integration 
app.get('/realtime', function(req, res){
 //res.send('Event: ' + req.param('cid'));
   console.log("got request: " + req.param('event'));

 if(req.param('event') == "NewCall")
 {
	io.sockets.emit('start', { ph : req.param('cid') });
	res.send('<response><playaudio>http://yourpbx.in/slot1.wav</playaudio></response>');
	 
	
}
 else if(req.param('event') == "Hangup")
 {
	io.sockets.emit('stop', { ph : req.param('cid') });	
	res.send('<response><hangup/></response>');
	
 }
 else if(req.param('event') == "Disconnect")
 {
	io.sockets.emit('stop', { ph : req.param('cid') });	
	res.send('<response><hangup/></response>');
	
 }
 else
 {
	res.send('<response><playaudio>http://yourpbx.in/slot1.wav2</playaudio></response>');
	 
 }

 	//everyone.now.receiveMessage(myArray[cnt++], "Ph:"+ req.param('cid'));
});//getrealtime close

io.sockets.emit('news', { ph : 'bla' });	
//console.log(io.sockets);

app.listen(process.env.VCAP_APP_PORT || 5000);
