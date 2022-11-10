import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { delay, of } from 'rxjs';
import { AppStore } from 'src/app/app.store';
import { DELAY, GAP, IRefresh, RefreshEvent } from 'src/app/models';

@Component({
  selector: 'app-visibilitychange-refresh-card[refreshEvent]',
  templateUrl: './visibilitychange-refresh-card.component.html',
  styleUrls: ['./visibilitychange-refresh-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule
  ]
})
export class VisbilitychangeRefreshCardComponent implements OnInit, OnDestroy {
  @Input() refreshEvent!: RefreshEvent;

  readonly eventName = 'visibilitychange';

  refreshCount = 0;
  refreshs: IRefresh[] = [];

  refreshWithVisibilityStateCount = 0;
  refreshsWithVisibilityState: IRefresh[] = [];

  constructor(private readonly appStore: AppStore) { }

  ngOnInit(): void {
    document.addEventListener(this.eventName, this.refresh, true);
    document.addEventListener(this.eventName, this.refreshWithVisibilityState, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener(this.eventName, this.refresh, true);
    document.removeEventListener(this.eventName, this.refreshWithVisibilityState, true);
  }

  selectRefreshEvent(event: RefreshEvent): void {
    this.appStore.selectRefreshEvent(event);
  }

  private readonly refresh: (e: Event) => void = () => {
    this.refreshCount++;
    const refresh: IRefresh = {
      pourcentage: 0
    } 
    this.refreshs.push(refresh);
    const interval = setInterval(() => {
      refresh.pourcentage += GAP;
    }, DELAY * GAP / 100);
    of(null).pipe(delay(DELAY)).subscribe(() => {
      const index = this.refreshs.indexOf(refresh);
      this.refreshs.splice(index, 1);
      clearInterval(interval);
    });
    if (this.refreshEvent === 'visibilitychange') {
      this.appStore.refreshTrainings();
    }
  }

  private readonly refreshWithVisibilityState: (e: Event) => void = () => {
    if (document.visibilityState === 'hidden') {
      return;
    }
    this.refreshWithVisibilityStateCount++;
    const refresh: IRefresh = {
      pourcentage: 0
    } 
    this.refreshsWithVisibilityState.push(refresh);
    const interval = setInterval(() => {
      refresh.pourcentage += GAP;
    }, DELAY * GAP / 100);
    of(null).pipe(delay(DELAY)).subscribe(() => {
      const index = this.refreshsWithVisibilityState.indexOf(refresh);
      this.refreshsWithVisibilityState.splice(index, 1);
      clearInterval(interval);
    });
    if (this.refreshEvent === 'visibilitychangeState') {
      this.appStore.refreshTrainings();
    }
  }
}