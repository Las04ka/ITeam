import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, Subscription, timer} from "rxjs";

import {Stopwatch} from "./stopwatch.interface";

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  initialTime = 0;

  private timer$: BehaviorSubject<number> = new BehaviorSubject(
    this.initialTime
  );
  public isRunning: boolean = false;
  private timerSubscription: Subscription = new Subscription();
  private lastStoppedTime: number = this.initialTime;

  public get stopWatch$(): Observable<Stopwatch> {
    return this.timer$.pipe(
      map((seconds: number): Stopwatch => this.secondsToStopwatch(seconds))
    );
  }
  startTimer(): void {
    if (this.isRunning) {
      return;
    }
    this.timerSubscription = timer(0, 1000)
      .pipe(map((value: number): number => value + this.lastStoppedTime)).subscribe(this.timer$);
    this.isRunning = true;
  }

  stopTimer(): void {
    this.lastStoppedTime = this.timer$.value;
    this.timerSubscription.unsubscribe();
    this.isRunning = false;
  }

  resetTimer(): void {
    this.timerSubscription.unsubscribe();
    this.lastStoppedTime = this.initialTime;
    this.timer$.next(this.initialTime);
    this.isRunning = false;
  }

  private secondsToStopwatch(seconds: number): Stopwatch {
    return {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor(seconds / 60 % 60),
      seconds: seconds % 60,
    }
  }
}
