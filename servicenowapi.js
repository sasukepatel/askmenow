var request = require("request");

//var snowtoken = "BPIeIToVPQen2e49HZqrE4dyFW9yMCTjOPoVqKWsgch-WnJZN59FmWYgu8Ii9sH77Zb2me1bsyTBpTvoMo5kvg";
var userid = 'askmenowbot';
var password = "Bot90338";

var auth = {
    'user': userid,
    'pass': password,
    'sendImmediately': false
  }

var queueid = "4c80e996db14b200f485773ebf961925";
var acceptURL = "https://dev23858.service-now.com/api/now/connect/support/queues/"+queueid+"/accept";

//*******Aceept chat**********
function acceptChat(callback){
    request.post(acceptURL, {
 'auth': auth
},callback);

}
function getMsg(convId,callback){
    request.get('https://dev23858.service-now.com/api/now/connect/conversations/'+convId+'/messages', {
 'auth': auth
},callback);
}
//*********Get Queues********
function getQueues(callback){
request.get('https://dev23858.service-now.com/api/now/connect/support/queues', {
 'auth': auth
},callback);
}

function sendMsg(convId,msg,callback){
    request.post('https://dev23858.service-now.com/api/now/connect/conversations/'+convId+'/messages', {
 'auth': auth,
 'body':msg,
 'json':true
},callback);
}

function snWebhook(aiObj,callback){
     request.post('https://dev23858.service-now.com/api/9187/v1/bot_webhook_api_ai/apiai', {
 'auth': auth,
 'body':aiObj,
 'json':true
},callback);
}

function closeOldChats(oldChats){
    oldChats.forEach(function(chat){
         request.post('https://dev23858.service-now.com/api/now/connect/support/sessions/'+chat+'/close', {
 'auth': auth
});
    })
   
}

exports.acceptChat = acceptChat;
exports.getQueues = getQueues;
exports.sendMsg = sendMsg;
exports.getMsg = getMsg;
exports.snWebhook = snWebhook;
exports.closeOldChats = closeOldChats;


