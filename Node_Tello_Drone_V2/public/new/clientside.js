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
    console.log(event)
    ws.send("Hello mortals" + event.toString())

}

function bop(){
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
      }
    }
    var e = document.getElementById("methodname");
    var methodname = e.options[e.selectedIndex].value;
    console.log(methodname)
    var param = document.getElementById("param").value
    console.log(param)
    //TODO add switch case to auto assign param to proper param type
    msg.method.name = methodname;
    switch(methodname){
      case"create":
      msg.method.param.host = document.getElementById("host").value
      msg.method.param,port = document.getElementById("port").value
      case"commandmode":
      case"RecordData":
      case"takeOff":
      case"land":
      case"flyUp":
      case"flyDown":
      case"flyLeft":
      case"flyRight":
      case"flyForward":
      case"flyBack":
      case"rotate":
      case"flipDrone":
      case"setSpeed":
      case"closeConnections":
      case"currentBattery":
      case"currentSpeed":
      case"currentFlightTime":
    }

    var strmsg = JSON.stringify(msg)
  //  ws.send(strmsg)
   alert("sent")
}
var voiceCommands ={
    'hello': function() { alert('Hello world!'); }
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

