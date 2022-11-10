import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppStore } from './app.store';
import { FocusRefreshCardComponent } from './refresh-cards/focus-refresh-card/focus-refresh-card.component';
import { VisbilitychangeRefreshCardComponent } from './refresh-cards/visibilitychange-refresh-card/visibilitychange-refresh-card.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    VisbilitychangeRefreshCardComponent,
    FocusRefreshCardComponent,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [AppStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
