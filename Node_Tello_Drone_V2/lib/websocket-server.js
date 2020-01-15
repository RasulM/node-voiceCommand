const Websocket = require("ws");

module.exports = class WWSWITHMSGHANDLER{
    constructor(PATH,PORT){
        this.wss = new Websocket.Server({
            path:PATH,
            port:PORT
        
        })
        this.n =0;
        this.wss.on("connection",(ws)=>{
            console.log("Connection open")
            ws.on("message",(data)=>{
             this.handleMessage(data,ws)
            }) 

        })
            

    }

    handleMessage(data,ws){
        console.log(data)
        var msg = JSON.parse(data)
        switch(msg.method.name){
            case 'create':
                console.log("created")
                break;
            case '':
                break;
            case '':
                break;
            case '':
                break;
            default: 

            

        }
    }
    

}

