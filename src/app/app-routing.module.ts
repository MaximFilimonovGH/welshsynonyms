import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { AboutPageComponent } from './about-page/about-page.component';


const routes: Routes = [
  //{ path: 'game', component: GameComponent },
  //{ path: 'about', component: AboutPageComponent}
  { path: 'about', pathMatch: 'full', component: AboutPageComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
