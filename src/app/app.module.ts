import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';

import { AngularMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AboutPageComponent } from './about-page/about-page.component';
import { GameAdvancedComponent } from './game-advanced/game-advanced.component';
import { HintDialogComponent } from './game-advanced/hint-dialog/hint-dialog.component';

import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    AboutPageComponent,
    GameAdvancedComponent,
    HintDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularMaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CountdownModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
