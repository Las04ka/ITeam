import {Component} from '@angular/core';
import {Stopwatch} from "./stopwatch.interface";
import {StopwatchService} from "./stopwatch.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  firstClickChecked = false;
  stopwatch: Stopwatch = {
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  isPaused: boolean = false;


  constructor(public _stopwatchService: StopwatchService) {
    this._stopwatchService.stopWatch$.subscribe(
      (el: Stopwatch) => (this.stopwatch = el)
    )
  }

  start() {
    this.reset()
    this._stopwatchService.startTimer()
    this.isPaused = true;
  }

  stop() {
    this._stopwatchService.stopTimer()
    this.isPaused = false;
  }

  wait() {
    if (this.firstClickChecked) {
      if (this._stopwatchService.isRunning) {
        this._stopwatchService.stopTimer();
      } else {
        this._stopwatchService.startTimer();
      }
    } else {
      this.firstClickChecked = true
      setTimeout(() => this.firstClickChecked = false, 300)
    }
  }

  reset() {
    this._stopwatchService.resetTimer()
    this.isPaused = false
  }
}
