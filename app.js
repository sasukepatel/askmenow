//import express for webserver
var express = require('express')
var bodyParser  = require("body-parser");

//import apiai library
var apiai = require('apiai');
var apiapp = apiai(process.env.apiAiClientId);
var cors = require('cors')
//import servicenowapi file
var snapi = require("./servicenowapi.js");

//instantiate express
var app = express()
app.use(bodyParser.json());
app.use(cors());

var chatGrpId;
app.get('/', function (req, res) {
  
  console.log('get');
   res.send("Bot Lives here!");
})

app.post('/chatinit',function(req,res){
   console.log("accept it");
 //  console.log(req.body);
  snapi.closeOldChats(req.body.oldChats);
            snapi.acceptChat(function callback(error, response, body) {
         var bodyObj = JSON.parse(body);
        
      //   console.log(req.body);

   if(bodyObj.status == 'failure' || bodyObj.result.error){
       res.status(401);
       res.send(bodyObj.result);
   }else{
        res.send(bodyObj);
       beginChatting(bodyObj,req.body);
      
   }
  
    
});
  

});


//WEBHOOK FOR FULFILLING REQUEST
app.post('/webhook',function(req,res){
   // console.log(req.body);
    var aireqMsg = req.body;
    var resObj = {};
   
        snapi.snWebhook(aireqMsg,function(error,response,body){
            //console.log(body.result);
            
            
            
            res.json(body.result);
        });
        
     
});
app.post('/messageupdate',function(req,res){
    console.log("I think Message came!");
    res.send("Got you!will quey Connect for actual message!");
    
   // console.log("2:" + chatGrpId);
    var data = req.body;
   //console.log(data);
    
    snapi.getMsg(data.grpId,function(error,response,body){
        console.log('sent getmsg');
        console.log(body);
        var bodyData = JSON.parse(body);
        console.log("bodtData lenght:" + bodyData.result.length);
        if(bodyData.result.length > 0){
            console.log("send MSGSGNOW");
             processMsg(data.grpId,body);
        }
     
    });
});

function beginChatting(bodyObj,miscObj){
    console.log("bneogngc chatting");
   // console.log(bodyObj);

   console.log("beignchating:"+chatGrpId);
    var msg = {};
        msg.message = "Hello "+ miscObj.username;
    snapi.sendMsg(bodyObj.result.group,msg,function callbackChating(error,response,body){
      // console.log(body);
      
    })
    }
    
function processMsg(convId,data){
    console.log(convId)
  
      //  console.log(data);
        var messagesObj = JSON.parse(data);
        //console.log(messagesObj);
        var lastMsg = messagesObj.result[0].formatted_message;
        //var context = messagesObj.result[0].context;
        var user = messagesObj.result[0].profile;
        console.log("user:" + user);
        console.log(user);
        if(!context){
           var context = user;
}
      var request = apiapp.textRequest(lastMsg, {
    sessionId: context,
    data:user
});

request.on('response', function(response) {
  //  console.log(response);
     var msg = {
            "message": response.result.fulfillment.speech
        }
      snapi.sendMsg(convId,msg,function(error,response,body){});
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
       
    }


app.listen(process.env.PORT, function () {
  console.log('Server running!')
})


