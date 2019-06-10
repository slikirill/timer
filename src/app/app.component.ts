import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer, fromEvent } from 'rxjs';
import {map, exhaustMap, take, delay} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy  {

  private timerStarted: boolean = false;
  private startBtnText: string = 'Start';
  private timerValue: number = 0;
  private subscription; 

  ngOnInit() {
    const start$ = fromEvent(document.querySelector('.start'), 'click');
    const start = start$.subscribe ((e) => {
      this.timerStarted = !this.timerStarted ? true : false;
      this.startBtnText = !this.timerStarted ? 'Start' : 'Stop';
      !this.timerStarted ? this.subscription.unsubscribe() : this.startTimer();
    });

    const wait$ = fromEvent(document.querySelector('.wait'), 'click');
    const wait = wait$.pipe(
      exhaustMap(() =>
      wait$.pipe(
        take(2),
        delay(300),
        map(() => {
          this.subscription.unsubscribe();
          this.startBtnText = 'Start';
          this.timerStarted = false;
        })
      ))
    ).subscribe();

    const reset$ = fromEvent(document.querySelector('.reset'), 'click');
    const reset = reset$.subscribe ((e) => {
      this.timerValue = 0;
    });
  }

  private startTimer() {
    let Timer = timer(1, 1000).pipe(
      map(t => {
        this.timerValue++;
    })
    );
    this.subscription = Timer.subscribe();
  }

  private getTimerString() {
    return this.pad(Math.floor((this.timerValue / 60) / 60)) + ' : ' + this.pad((Math.floor(this.timerValue / 60)) % 60) + ' : ' + this.pad(this.timerValue % 60);
  }

  private pad(digit: any) { 
    return digit <= 9 ? '0' + digit : digit;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
