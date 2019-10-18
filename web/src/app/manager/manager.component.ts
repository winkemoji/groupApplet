import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http" //这里是HttpClient

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {


  headers = new HttpHeaders({'Access-Control-Allow-Origin' : '*'})


  localUrl='ws://127.0.0.1:5001/api/people'
  serverUrl='ws://49.232.18.140:5001/api/people'

  localManagerUrl = 'ws://127.0.0.1:5001/api/users'
  serverManagerUrl = 'ws://49.232.18.140:5001/api/users'

  isGetRes = false

  user = ''
  dlUser = ''
  userList = ''
  temp = ''
  pairNums:number

  eachGroup:number
  
  groupNum:number

  res = ''
  
  
  
  ws: WebSocket;//定义websocket

  constructor(private http:HttpClient) {

   }
   reSet(){
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket(this.serverManagerUrl);
    let that = this
    this.ws.onopen = function(event){
      //socket 开启后执行，可以向后端传递信息
      that.ws.send('reset:' + '1');
      that.getUserList();
    }
    this.ws.onmessage = function (event) {
      //socket 获取后端传递到前端的信息
      let args = event.data.split(':');
    }
   }

   changeStatus(status){
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket(this.serverManagerUrl);
    let that = this
    this.ws.onopen = function(event){
      //socket 开启后执行，可以向后端传递信息
      that.ws.send('status:' + status);
      that.getUserList();
    }
    
    this.ws.onmessage = function (event) {
      //socket 获取后端传递到前端的信息
      let args = event.data.split(':');
    }
  }

  createPair(){
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket(this.serverManagerUrl);
    let that = this
    this.ws.onopen = function(event){
      //socket 开启后执行，可以向后端传递信息
      that.groupNum = that.pairNums/that.eachGroup;

      console.log('that.eachGroup: ' + that.eachGroup)

      if(!isNaN(that.groupNum) && that.eachGroup.toString()!=''){
        that.ws.send('distribution:' + that.eachGroup);
      }  

      that.getUserList()
    }
    
    this.ws.onmessage = function (event) {
      //socket 获取后端传递到前端的信息
      let args = event.data.split(':');
      
    }
  }


  deleteUser(){
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket(this.serverManagerUrl);
    let that = this
    this.ws.onopen = function(event){
      //socket 开启后执行，可以向后端传递信息
      that.ws.send('deleteUsr:' + that.dlUser);
      that.dlUser = ''
      that.getUserList();
    }
    
    this.ws.onmessage = function (event) {
      //socket 获取后端传递到前端的信息
      let args = event.data.split(':');
    }
  }

  addUser(){
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket(this.serverManagerUrl);
    let that = this
    this.ws.onopen = function(event){
      //socket 开启后执行，可以向后端传递信息
      that.ws.send('addUsr:' + that.user);
      that.user = ''
      that.getUserList();
    }
    
    this.ws.onmessage = function (event) {
      //socket 获取后端传递到前端的信息
      let args = event.data.split(':');
    }
  }

  getUserList(){
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket(this.serverUrl);
    let that = this
    this.ws.onopen = function(event){
      //socket 开启后执行，可以向后端传递信息
    }
    this.ws.onmessage = function (event) {
      //socket 获取后端传递到前端的信息
      let args = event.data.split(':');
    
      if(args[0] == 'pairPeople'){
        that.userList = JSON.parse(args[1])
      }
      if(args[0] == 'queueNum'){
        that.pairNums = args[1];      
      }
      if(args[0] == 'res'){
        that.res = JSON.parse(args[1])
        that.isGetRes = true
      }
    }
  }

  calGroupNum(){

    
    
  }
  ngOnInit() {
    this.getUserList();
  }

}
