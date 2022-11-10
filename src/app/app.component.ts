import { Component, OnInit } from '@angular/core';
import { AppStore } from './app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly trainings$ = this.appStore.trainings$;
  readonly isLoading$ = this.appStore.isLoading$;
  readonly refreshEvent$ = this.appStore.refreshEvent$;
  
  constructor(private readonly appStore: AppStore) {}
  
  ngOnInit(): void {
    this.appStore.refreshTrainings();
  }
}
