import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ITraining } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FakeTrainingDataService {
  getRandomTrainings(delayValue: number, length: number): Observable<ITraining[]> {
    const trainings: ITraining[] = Array.from({ length }, (_, index) => ({ name: `Formation ${index + 1}` }));
    return of(trainings).pipe(delay(delayValue));
  }
}
