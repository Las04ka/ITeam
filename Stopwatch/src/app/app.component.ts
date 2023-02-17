import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, map, Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {
  firstClickChecked: boolean = false;
  isRunning: boolean = false;
  timer$: BehaviorSubject<number> = new BehaviorSubject(0);
  timerSubscription: Subscription = new Subscription();

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  startTimer(): void {
    const delay:number = this.timer$.value / 1000 + 1;
    this.timerSubscription = interval(1000)
      .pipe(map(initialTime => initialTime + delay))
      .subscribe(value => this.timer$.next(value * 1000));
    this.isRunning = true;
  }

  start():void {
    this.reset()
    this.startTimer()
  }
  stop():void {
    this.timerSubscription.unsubscribe();
    this.isRunning = false;
  }
  wait():void {
    if (this.firstClickChecked) {
      if (this.timerSubscription.closed) {
        this.startTimer();
      } else {
        this.timerSubscription.unsubscribe();
      }
    } else {
      this.firstClickChecked = true
      setTimeout(() => this.firstClickChecked = false, 300)
    }
  }
  reset():void {
    this.timerSubscription.unsubscribe();
    this.timer$.next(0)
    this.isRunning = false;
  }
}
