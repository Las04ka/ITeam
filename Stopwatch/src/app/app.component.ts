import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatButton } from "@angular/material/button";
import {
  BehaviorSubject,
  buffer,
  debounceTime,
  filter,
  fromEvent,
  interval,
  map,
  Subscription,
  take
} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {
  @ViewChild('waitBtn', { static: true }) btn!: MatButton;

  isRunning: boolean = false;
  timer$: BehaviorSubject<number> = new BehaviorSubject(0);
  timerSubscription: Subscription = new Subscription();

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  startTimer(): void {
    const delay: number = this.timer$.value / 1000 + 1;
    this.timerSubscription = interval(1000)
      .pipe(map(initialTime => initialTime + delay))
      .subscribe(value => this.timer$.next(value * 1000));
    this.isRunning = true;
  }

  onStart(): void {
    this.onReset()
    this.startTimer()
    console.log(this.btn)
  }

  onStop(): void {
    this.timerSubscription.unsubscribe();
    this.isRunning = false;
  }

  onWait(): void {
    const click$ = fromEvent(this.btn._elementRef.nativeElement, 'click');
    click$
      .pipe(
        take(2),
        buffer(click$.pipe(debounceTime(300))),
        filter((clicks) => clicks.length >= 2)
      )
      .subscribe((_) => {
        (this.timerSubscription.closed) ? this.startTimer() : this.timerSubscription.unsubscribe()
      });
  }

  onReset(): void {
    this.timerSubscription.unsubscribe();
    this.timer$.next(0)
    this.isRunning = false;
  }
}
