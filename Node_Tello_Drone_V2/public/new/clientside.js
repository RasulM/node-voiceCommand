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
    alert("sent")
    var e = document.getElementById("methodname");
    var methodname = e.options[e.selectedIndex].value;
    console.log(methodname)
    var param = document.getElementById("param").value
    console.log(param)
    //TODO add switch case to auto assign param to proper param type
    var msg = {
        "method":{
            "name":methodname,
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
    var strmsg = JSON.stringify(msg)
  //  ws.send(strmsg)
}


