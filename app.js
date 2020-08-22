const express = require('express');
const path = require('path');
const User = require('./modules/user/router.js');
const Login = require('./modules/home/router.js');
const Kita = require('./modules/kita/router.js');
const Group = require('./modules/group/router.js');
const calendarEvent = require('./modules/calendar/router.js');
const Chat = require('./modules/chat/router.js');
const smsNotify = require('./modules/smsNotify/router');
const feedbackMsg = require('./modules/feedbackMsg/router');

require('./config/db_connection.js');
require('./config/passport.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
const app = express();
var cookieParser = require('cookie-parser');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets/img/profil_picture');
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, Date.now() + '-' +  file.originalname);
        }
    }
})

var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single('myFile');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

//Routers
app.use('/user', User);

//Routers
app.use('/home', Login);

//Routers
app.use('/kita', Kita);

//Routers
app.use('/kita/group', Group);

//Routers
app.use('/calendar', calendarEvent);

//Routers
app.use('/chat', Chat);

//Routers
app.use('/smsnotify', smsNotify);

//Routers
app.use('/feedback', feedbackMsg);

// FileUpload
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'Die Dateigrösse ist zu gross! Max. 10MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'Die Datei entspricht nicht dem gewünschten Dateiformat! (JPG, JPEG, PNG)'});
            }else {
                console.log(err);
                res.json({success: false, message: 'Der Upload der Datei konnte nicht abgeschlossen werden.'});
            }
        }else{
            if(!req.file){
                res.json({success: false, message: 'Es wurde keine Datei für den Upload ausgewählt!'});
            }else{
                res.json({success: true, message: 'Die Datei wurde erfolgreich hochgeladen.', file: req.file});
            }
        }
    })
})


// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({"message" : err.name + ": " + err.message});
    }
  });


// web server 8080

app.listen(8080, () => console.log('-------------------------------------- \n [iKita app] Web server listening on port 8080! \n--------------------------------------'));

// Socket Server Engine

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 8081;

server.listen( port ,function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("\n\n---------------------------- iKita Chat Server Running ----------------------------\n");
    console.log("[ iKita Chat ] "+" server running at http://"+host+':'+port);
});

let users = {};
let AdminSocket = {};
let connections = [];

io.on('connection', function(socket){

    connections.push(socket);

    console.log(" [ iKita Chat ] => =>  user connected, .... socket.io reported =>", socket.id);

    socket.on('send:message', function (data) {
        /*
            message : vm.writingMessage,
			senderid: vm.username,
			sendername: vm.myUserId,
			receiverid: AdminUserID,
			receivername: AdminUserName
        */
        console.log(data.sendername + " user send message to " + data.receivername + " user, message => " + data.message);
        console.log(users);
        if (users[data.receiverid]){
            var user = users[data.receiverid];
            user.socketData.emit('recive:message', data);
        }else{
            //User is not online - need to push notification
            var user = users[data.senderid];
            user.socketData.emit('undelivered:message', data);
        }
    });

    socket.on('user:register', function (data) {
        // my msg
        var myData = {
            userData : data,
            socketData : socket
        }
        users[data.userid] = myData;

        if (data.isAdmin == true){
            AdminSocket['admin'] = myData;
        }

        if (AdminSocket['admin']){
            AdminSocket['admin'].socketData.emit('user:online', data);
        }
        //console.log(users);
    });

    socket.on('online:checker', function(data){
        data.checker.forEach(element => {
            if (users[element['uID']]){
                if (AdminSocket['admin']){
                    AdminSocket['admin'].socketData.emit('user:online', {userid : element['uID']});
                }
            }
        });
    
        
    });

    socket.on('disconnect', function (data) {
        //io.emit('user:left', data);       
        console.log(' [ iKita Chat ] => =>  ....user disconnected....');
    });

});
