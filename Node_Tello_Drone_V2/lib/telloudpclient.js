const dgram = require("dgram")
const cron = require("node-cron")


module.exports = class TelloController{
    constructor(Host,PORT){
        this.HOST = Host;
        this.PORT = PORT;
        this.client = dgram.createSocket('udp4');
        this.currentSpeedclient = dgram.createSocket('udp4');
        this.currentBatteryclient = dgram.createSocket('udp4');
        this.currentFlightTimeclient = dgram.createSocket('udp4');
        this.messageHistory = []
        this.messageresponseHistory = [] 
        this.currentSpeedresponseHistory = []
        this.currentBatteryresponseHistory = []
        this.currentFlightTimeresponseHistory = []
        this.isInCommandMode;
        this.currentSpeed;
        this.currentBattery;
        this.currentFlightTime;
        this.flipdirections ={
            forward :"f",
            right : "r",
            left : "l"
        }
        
        this.currentSpeedclient.on('message',function(msg,info){
            var fmsg;
            fmsg = 'Data received from server for Speed : ' + msg.toString() +'---- Received %d bytes from %s:%d\n',msg.length, info.address, info.port
            this.currentSpeedresponseHistory.unshift(msg.toString())
            console.log(fmsg);
        });
        this.currentBatteryclient.on('message',function(msg,info){var fmsg;
            fmsg = 'Data received from server for Battery : ' + msg.toString() +'---- Received %d bytes from %s:%d\n',msg.length, info.address, info.port
            this.currentBatteryresponseHistory.unshift(msg.toString())
            console.log(fmsg);}
            )
        this.currentFlightTimeclient.on('message',function(msg,info){
            var fmsg;
            fmsg = 'Data received from server :  for Flight' + msg.toString() +'---- Received %d bytes from %s:%d\n',msg.length, info.address, info.port
            this.currentFlightTimeresponseHistory.unshift(msg.toString())
            console.log(fmsg);
        })
        this.client.on('message',function(msg,info){
            var fmsg;
            fmsg = 'Data received from server : ' + msg.toString() +'---- Received %d bytes from %s:%d\n',msg.length, info.address, info.port
            this.messageresponseHistory.unshift(fmsg)
            console.log(fmsg);
          });
          

    }

    formatAddMessageToMessageHistory(message){
        formattedmessage = `Time:${Date.now}:Message:${messsge}`
        this.messageHistory.push(formattedmessage)
        
    }

     startCommandMode(){
        sendcommand('command');
        isInCommandMode = true;
        formatAddMessageToMessageHistory('command');
    }

    startRecordData(){
        cron.schedule("* * * * *",function(){
            console.log("Starting to log ")
            this.sendcommand("Speed?",this.currentSpeedclient);
            this.sendcommand("Battery?",this.currentBatteryclient);
            this.sendcommand("Time?",this.currentFlightTimeclient);
        })
        
    }
    

    sendcommand(message,udpclient){
      if(udpclient!== undefined){ msg =  Buffer.from(message)
        udpclient.send(msg,0,msg.length,this.PORT,this.HOST)
        }else{
           var msg = Buffer.from(message)
        this.client.send(msg,0,msg.length,this.PORT,this.HOST)
        }   
    }
    
     isValidDistance(cm){
        if(20<cm<500) return true
    }
    
     isValidDegree(degrees){
        if(-360<degrees<360) return true
    }


    
    takeOff(){
      if(isInCommandMode) this.sendcommand('takeoff');
      else{
          console.log(`not in command mode`)
      }
    }
    
    land(){
        if(isInCommandMode) this.sendcommand('land');
        else{
            console.log(`not in command mode`)
        }
        ;
    }
    
    flyUp(cm){
         if(isInCommandMode && isValidDistance(cm)){
            this.sendcommand(`up ${cm}`)
         }else{
             console.log(`ERROR---command mode: ${isInCommandMode} and is ${cm} needs to be between 20 and 500 `)
         }
    
    }
    
     flyDown(cm){
        if(isInCommandMode && isValidDistance(cm)){
            this.sendcommand(`down ${cm}`)
        }else{
            console.log(`ERROR---command mode: ${isInCommandMode} and is ${cm} needs to be between 20 and 500 `)
        }
    
    }
    
     flyLeft(cm){
        if(isInCommandMode && isValidDistance(cm)){
            this.sendcommand(`left ${cm}`)
        }else{
            console.log(`ERROR---command mode: ${isInCommandMode} and is ${cm} needs to be between 20 and 500 `)
        }
    
    }
    
     flyRight(cm){
        if(isInCommandMode && isValidDistance(cm)){
            this.sendcommand(`right ${cm}`)
        }else{
            console.log(`ERROR---command mode: ${isInCommandMode} and is ${cm} needs to be between 20 and 500 `)
        }
    
    }
    
     flyForward(cm){
        if(isInCommandMode && isValidDistance(cm)){
            this.sendcommand(`forward ${cm}`)
        }else{
            console.log(`ERROR---command mode: ${isInCommandMode} and is ${cm} needs to be between 20 and 500 `)
        }
    
    }
    
     flyBack(cm){
        if(isInCommandMode && isValidDistance(cm)){
            this.sendcommand(`back ${cm}`)
        }else{
            console.log(`ERROR---command mode: ${isInCommandMode} and is ${cm} needs to be between 20 and 500 `)
        }
    
    }
    
     rotate(degrees){
        if(isInCommandMode && isValidDegree(degrees)){
            if(degrees > 0){
                this.sendcommand(`cw ${degrees}`)
            }else if(degrees < 0){
                this.sendcommand(`ccw ${degrees}`)
            }
        }else{
            console.log(`ERROR--- command mode: ${isInCommandMode} and is ${degrees} needs to be between 1 and 3600 or -1 and -3600 `)
        }
    
    }
    
     flipDrone(direction){
       if(isInCommandMode)  sendcommand(`flip ${direction}`)
       else console.log(`ERROR--- command mode: ${isInCommandMode} and is ${degrees} needs to be between 1 and 3600 or -1 and -3600 `)
        
    }
    
    setSpeed(centimeterPerSecond){
        if(isInCommandMode && 1<centimeterPerSecond<100){
            this.sendcommand(`speed ${centimeterPerSecond}`)
        }else{
            console.log(`ERROR---- command mode: ${isInCommandMode} speed is ${centimeterPerSecond} needs to be between 1 and 100 `)
       
        }
    }

    closeConnections(){
        this.client.close()
        this.currentBatteryclient.close()
        this.currentFlightTimeclient.close()
        this.currentSpeedclient.close()
    }
    
    get currentBattery(){
        this.sendcommand(`Battery?`,this.currentBatteryclient)
        return this.currentBatteryresponseHistory[0]
    }
    
    get currentSpeed(){
        this.sendcommand(`Speed?`,this.currentSpeedclient)
        return this.currentSpeedresponseHistory[0]
    }
    
    get currentFlightTime(){
        this.sendcommand(`Time?`,this.currentFlightTimeclient)
        return this.currentBatteryresponseHistory[0]
    }

}





