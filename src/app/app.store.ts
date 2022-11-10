import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, tap, withLatestFrom } from "rxjs";
import { DELAY, ITraining, MAX_TRAININGS_LENGTH, RefreshEvent } from "./models";
import { FakeTrainingDataService } from "./services/fake-training-data.service";

interface AppState {
    isLoading: boolean;
    trainings: ITraining[];
    lastLength: number;
    refreshEvent: RefreshEvent;
}

@Injectable()
export class AppStore extends ComponentStore<AppState> {
    
    readonly trainings$ = this.select(({ trainings }) => trainings);
    readonly isLoading$ = this.select(({ isLoading }) => isLoading);
    readonly refreshEvent$ = this.select(({ refreshEvent }) => refreshEvent);

    private readonly lastLength$ = this.select(({ lastLength }) => lastLength);

    readonly selectRefreshEvent = this.updater((state, refreshEvent: RefreshEvent) => ({
        ...state,
        refreshEvent: state.refreshEvent !== refreshEvent ? refreshEvent : 'none'
    }));
  
    constructor(private readonly fakeTrainingDataService: FakeTrainingDataService) {
        super({ isLoading: true, trainings: [], lastLength: 0, refreshEvent: 'none' });
    }

    readonly refreshTrainings = this.effect((void$: Observable<void>) => {
        return void$.pipe(
            tap(() => this.patchState({ isLoading: true })),
            withLatestFrom(this.lastLength$),
            switchMap(([, lastLength]) => {
                const length = this.getRandomLength(MAX_TRAININGS_LENGTH, lastLength);
                this.patchState({ lastLength: length });
                return this.fakeTrainingDataService.getRandomTrainings(DELAY, length);
            }),
            tap(trainings => this.patchState({ trainings, isLoading: false })),
        );
    });

    private getRandomLength(length: number, except: number): number {
        const randomLengths = Array.from({ length }, (_, i) => i + 1);
        if (except) {
            randomLengths.splice(except - 1, 1);
        }
        return randomLengths[Math.floor(Math.random() * randomLengths.length)];
    }
}