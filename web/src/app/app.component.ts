import { Component,OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(){

  }
    

  ngOnInit(){
    
  }
  
}
