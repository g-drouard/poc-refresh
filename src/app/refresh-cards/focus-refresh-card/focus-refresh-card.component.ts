import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { delay, of } from 'rxjs';
import { AppStore } from 'src/app/app.store';
import { DELAY, GAP, IRefresh, RefreshEvent } from 'src/app/models';

type RefreshEventFocus = Extract<RefreshEvent, 'focus' | 'focusin' | 'blur' | 'focusout'>;

@Component({
  selector: 'app-focus-refresh-card[refreshEvent]',
  templateUrl: './focus-refresh-card.component.html',
  styleUrls: ['./focus-refresh-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule
  ]
})
export class FocusRefreshCardComponent implements OnInit, OnDestroy {
  @Input() refreshEvent!: RefreshEvent;

  events: {
    [k in RefreshEventFocus]: {
      refreshCount: number,
      refreshs: IRefresh[]
    }
  } = {
    focus: {
      refreshCount: 0,
      refreshs: []
    },
    focusin: {
      refreshCount: 0,
      refreshs: []
    },
    blur: {
      refreshCount: 0,
      refreshs: []
    },
    focusout: {
      refreshCount: 0,
      refreshs: []
    },
  }

  readonly eventKeys: RefreshEventFocus[] = Object.keys(this.events) as RefreshEventFocus[];

  constructor(private readonly appStore: AppStore) { }

  ngOnInit(): void {
    this.eventKeys.forEach(
      eventKey => {
        window.addEventListener(eventKey, () => this.refresh(eventKey), true);
      }
    );
  }

  ngOnDestroy(): void {
    this.eventKeys.forEach(
      eventKey => {
        window.removeEventListener(eventKey, () => this.refresh(eventKey), true);
      }
    );
  }

  selectRefreshEvent(event: RefreshEvent): void {
    this.appStore.selectRefreshEvent(event);
  }

  private readonly refreshFocus: (e: Event) => void = () => {
    this.refresh('focus');
  }

  private readonly refreshFocusin: (e: Event) => void = () => {
    this.refresh('focusin');
  }

  private readonly refreshBlur: (e: Event) => void = () => {
    this.refresh('blur');
  }

  private readonly refreshFocusout: (e: Event) => void = () => {
    this.refresh('focusout');
  }


  private refresh(refreshEvent: RefreshEventFocus): void {
    const event = this.events[refreshEvent];
    event.refreshCount++;
    const refresh: IRefresh = {
      pourcentage: 0
    } 
    event.refreshs.push(refresh);
    const interval = setInterval(() => {
      refresh.pourcentage += GAP;
    }, DELAY * GAP / 100);
    of(null).pipe(delay(DELAY)).subscribe(() => {
      const index = event.refreshs.indexOf(refresh);
      event.refreshs.splice(index, 1);
      clearInterval(interval);
    });
    if (this.refreshEvent === refreshEvent) {
      this.appStore.refreshTrainings();
    }
  }
}
