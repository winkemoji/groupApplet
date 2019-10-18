import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ManagerComponent } from './manager/manager.component';
import { UserComponent } from './user/user.component';
import { ManagerComponent } from './manager/manager.component';


const routes: Routes = [
  {path:'',component:UserComponent},
  {path:'user',component:UserComponent},//配置路由
  {path:'manager',component:ManagerComponent}
  //{path:'manager',component:ManagerComponent}//配置路由
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
