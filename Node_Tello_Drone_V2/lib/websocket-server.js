const Websocket = require("ws");
const TelloController = require("./telloudpclient")
module.exports = class WWSWITHMSGHANDLER{
    constructor(PATH,PORT){
        this.wss = new Websocket.Server({
            path:PATH,
            port:PORT
        
        })
        this.tello = {}
        this.telloFlag = false
        this.n =0;
        this.wss.on("connection",(ws)=>{
            console.log("Connection open")
            
            ws.on("message",(data)=>{
             this.handleMessage(data,ws)
            }) 

        })
            

    }

    IsTellocreated(func){
        if(this.telloFlag){
            func()
            return "success"
        }else{
            return "failed tello needs to be created"
        }
    }
    sendResult(msg ,ws,resultcode,CurrentBattery,CurrentFlightTime,CurrentSpeed){
        
        var wsresponse  = msg;
        wsresponse.response.result = resultcode
        wsresponse.response.currentBattery = CurrentBattery || ""
        wsresponse.response.currentFlightTime = CurrentFlightTime || ""
        wsresponse.response.currentSpeed = CurrentSpeed || ""
        ws.send(JSON.stringify(wsresponse));
    }

    handleMessage(data,ws){
        console.log(data)
        var msg = JSON.parse(data)
        var resultcode =""
        var CurrentBattery =""
        var CurrentFlightTime =""
        var CurrentSpeed =""
        var returnData ={
                currentBattery:'',
                currentSpeed:'',
                currentFlightTime:''
            }
        if(msg.method.name == "create"){
            var port= msg.method.param.port
            var host =msg.method.param.host
            this.tello = new TelloController(host,port)
            this.telloFlag = true
            console.log("created")
            this.sendResult(msg,ws,"create ok")
            }
        if(this.telloFlag == true && !msg.method.name == "create"){
            switch(msg.method.name){
                    case"commandmode":
                        this.tello.startCommandMode();
                        resultcode ="ok"
                        break;
                    case"RecordData":
                        this.tello.startRecordData();
                        
                        break;
                    case"takeOff":
                        this.tello.takeOff();
                        break;
                    case"land":
                        this.tello.land();
                        break;
                    case"closeConnections":
                        this.tello.closeConnections();
                        break;
                    case"currentBattery":
                        returnData.currentBattery = this.tello.currentBattery();
                        break;
                    case"currentSpeed":
                        returnData.currentSpeed = this.tello.currentSpeed();
                        break;
                    case"currentFlightTime":
                        returnData.currentFlightTime = this.tello.currentFlightTime();
                        break;
                    case"flyUp":
                          this.tello.flyUp(msg.method.param.distance);
                          break;
                    case"flyDown":
                        this.tello.flyDown(msg.method.param.distance);
                        break;
                    case"flyLeft":
                          this.tello.flyLeft(msg.method.param.distance);
                          break;
                    case"flyRight":
                          this.tello.flyRight(msg.method.param.distance);
                          break;
                    case"flyForward":
                          this.tello.flyForward(msg.method.param.distance);
                          break;
                    case"flyBack":
                          this.tello.flyBack(msg.method.param.distance);
                          break;
                    case"rotate":
                          this.tello.rotate(msg.method.param.degrees);
                          break;
                    case"flipDrone":
                          this.tello.flipDrone(msg.method.param.direction);
                          break;
                    case"setSpeed":
                          this.tello.setSpeed(msg.method.param.speed);
                          break;   
        
                }
               this.sendResult(msg,ws,resultcode,CurrentBattery,CurrentFlightTime,CurrentSpeed)
        }else if(this.telloFlag == false){
                this.sendResult(msg,ws,"Tello instance need to be create first")
            }
            
        }
    }