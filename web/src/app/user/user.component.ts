import { Component,OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})



export class UserComponent implements OnInit {

  localUrl='ws://127.0.0.1:5001/api/people'
  serverUrl='ws://49.232.18.140:5001/api/people'


  res = ''

  pairNums = 10

  ifPair = false

  userID = ''

  statusMsg = '未参与分组'

  manager_count = ''

  isGetRes = false

  userList = ''

  isOpen = 1
  isShow = 0
  isQueueUp = 0

  ws: WebSocket;//定义websocket
  constructor(private router:Router){

  }
 
  jumpToManager(){
    this.router.navigateByUrl('/manager')
  }

  join(){

    

    if(!this.ifPair){
      if (this.ws != null) { this.ws.close() };
      this.ws = new WebSocket(this.serverUrl);
      let that = this
      this.ws.onopen = function(event){
        if(that.userID!=that.manager_count){
          that.ws.send('add:' + that.userID);

        }else{
          that.jumpToManager()
        }
      }
      this.ws.onmessage = function (event) {
        //socket 获取后端传递到前端的信息
        //that.ws.send('sonmething');
        let args = event.data.split(':');
        
        if(args[0] == 'queueNum'){
          that.pairNums = args[1];      
        }
        if(args[0] == 'pairPeople'){
          that.userList = JSON.parse(args[1])
        }
        if(args[0] =='isOpen'){
          
          that.isOpen = args[1];


          if(Number(that.isOpen)&&that.userID!=''){
            that.ifPair = true
            that.statusMsg = '未参与分组'
            that.isShow = 1
          }else{
            if(that.userID==''){
              that.statusMsg = '用户ID不能为空'
            }else{
              that.statusMsg = '分组已关闭'
            }
            that.isShow = 0
          }

        }
        if(args[0] == 'isQueueUp'){
          
          that.isQueueUp = args[1];      
        }


        if(args[0] == 'res'){
          that.res = JSON.parse(args[1])
          console.log(that.res)
          that.isGetRes = true
        }

      }
      
    }
    }
    

  ngOnInit(){
    
    this.connectWs();
  }
      //socket连接
  connectWs() {
        if (this.ws != null) { this.ws.close() };
        this.ws = new WebSocket(this.serverUrl);
        let that  = this;
        // this.ws.onopen = function (event) {
        //         //socket 开启后执行，可以向后端传递信息
        //         that.ws.send('sonmething');
                
        // }
      
        this.ws.onmessage = function (event) {
                //socket 获取后端传递到前端的信息
                //that.ws.send('sonmething');
                let args = event.data.split(':');
  
                if(args[0] == 'queueNum'){
                  that.pairNums = args[1];
                }  
                
                if(args[0] == 'manager_account'){
                  that.manager_count = args[1];
                }

        }
        // this.ws.onerror = function (event) {
        //         //socket error信息
                
                
        // }
        // this.ws.onclose = function (event) {
        //         //socket 关闭后执行
               
        // }
    }
}
