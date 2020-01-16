var ws = new WebSocket('ws://localhost:8080/ws');
var isConnected = false;


ws.onopen = (event) =>{
 isConnected = true;
 alert("ready to send")
}

ws.onclose = ()=>{
    isConnected = false;
}

ws.onmessage =  (event) =>{
    console.log(event.data)
}

function bop(){
   
    var e = document.getElementById("methodname");
    var methodname = e.options[e.selectedIndex].value;
    console.log(methodname)
    var param = document.getElementById("param").value
    console.log(param)
    port = document.getElementById("port").value
    host = document.getElementById("host").value
    sendMethodToServer(methodname,param,host)
    
}
function sendMethodToServer(methodname,param,host ="192.168.10.1",port=8889){
    var msg = {
        "method":{
            "name":"methodname",
            "param":{
                "distance":"",
                "degrees":"",
                "direction":"",
                "speed":"",
                "host":"",
                "port":""
            }
        },
        "response":{}
      }

    msg.method.name = methodname;
    switch(methodname){
      case"create":
        msg.method.param.host = host
        msg.method.param.port = port
      break;
      case"flyUp":
          msg.method.param.distance = param
          break;
      case"flyDown":
      msg.method.param.distance = param
      break;
      case"flyLeft":
      msg.method.param.distance = param
          break;
      case"flyRight":
      msg.method.param.distance = param
          break;
      case"flyForward":
      msg.method.param.distance = param
          break;
      case"flyBack":
      msg.method.param.distance = param
          break;
      case"rotate":
      msg.method.param.degrees = param
          break;
      case"flipDrone":
      msg.method.param.direction = param
          break;
      case"setSpeed":
      msg.method.param.speed = param
          break;
    }

    var strmsg = JSON.stringify(msg)
    console.log(strmsg)
    ws.send(strmsg)

   alert("sent")
}

var voiceCommands ={
    'hello': function() { alert('Hello world!'); },
    'start connection': function() {sendMethodToServer("create")},
    'start command mode': function() {sendMethodToServer("commandmode")},
    'start recording data': function() {sendMethodToServer('RecordData')},
    'take off': function() {sendMethodToServer('takeOff')},
    'land': function() {sendMethodToServer('land')},
    'fly up :cm': function(cm) {sendMethodToServer('flyUp',cm)},
    'fly down :cm': function(cm) {sendMethodToServer('flyDown',cm)},
    'fly left :cm': function(cm) {sendMethodToServer('flyLeft',cm)},
    'fly right :cm': function(cm) {sendMethodToServer('flyRight',cm)},
    'fly forward :cm': function(cm) {sendMethodToServer('flyForward',cm)},
    'fly back :cm': function() {sendMethodToServer('flyBack')},
    'rotate :degress': function(degress) {sendMethodToServer('rotate',degress)},
    'flip :direction': function(direction) {sendMethodToServer('flipDrone',direction)},
    'set speed to :speed': function(speed) {sendMethodToServer('setSpeed',speed)},
    'close connection': function() {sendMethodToServer('closeConnections')},
    'get current battery level': function() {sendMethodToServer('currentBattery')},
    'get current speed': function() {sendMethodToServer('currentSpeed')},
    'get current flight time': function() {sendMethodToServer('currentFlightTime')}
   // '': function() {sendMethodToServer()}
  }

if (annyang) {
    // Add our commands to annyang
    annyang.addCommands(voiceCommands);
  
    // Tell KITT to use annyang
    SpeechKITT.annyang();
  
    // Define a stylesheet for KITT to use
    SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');
    SpeechKITT.setInstructionsText("Say a drone command")
    // Render KITT's interface
    SpeechKITT.vroom();
  }

