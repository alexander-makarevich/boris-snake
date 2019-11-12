import { Component, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import {UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW} from '@angular/cdk/keycodes';
import { fromEvent, interval } from 'rxjs';
import {withLatestFrom} from 'rxjs/operators';

enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}


interface SnakeUnit {
  x: number;
  y: number
}

type Snake = SnakeUnit[];

@Component({
  selector: 'app-area',
  template: `<canvas [hidden]="!check()" #canvas [width]="squareSidePx * maxWidth" [height]="squareSidePx * maxHeight"></canvas>
  <p *ngIf="!check()">Вы проиграли</p>`,
  styles: ['canvas { border-style: solid }']
})
export class AreaComponent implements OnDestroy, AfterViewInit {
  @ViewChild('canvas', { static: false }) 
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private keyUps = fromEvent(document, 'keyup');
  private tick = interval(1000);
  readonly maxWidth = 30;
  readonly maxHeight = 15;
  readonly squareSidePx = 10;

  private x = 0;
  private y = 0;
  private subscription;
  private snake: Snake = [{x: 10, y: 7}, {x: 11, y: 7}, {x: 12, y: 7}];

  drawSnake() {
    for(let unit of this.snake) {
      this.ctx.fillRect(unit.x * this.squareSidePx, unit.y * this.squareSidePx, this.squareSidePx, this.squareSidePx);
    }
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.squareSidePx, this.squareSidePx);

    this.drawSnake();

    this.subscription = this.tick
      .pipe(withLatestFrom(this.keyUps))
      .subscribe(([tick, event]: [number, KeyboardEvent]) => {
        console.log('tick: ' + tick + event.keyCode);

        switch(event.keyCode) {
          case RIGHT_ARROW:
            this.x++;
            break;
          case LEFT_ARROW:
            this.x--;
            break;
          case UP_ARROW:
            this.y--;
            break;
          case DOWN_ARROW:
            this.y++;
            break;
        }

        this.ctx.clearRect(0, 0, this.squareSidePx * this.maxWidth, this.squareSidePx * this.maxHeight);

        this.ctx.fillRect(this.x * this.squareSidePx, this.y * this.squareSidePx, this.squareSidePx, this.squareSidePx);
      });
  }

  check(): boolean {
    return 0 <= this.x && this.x < this.maxWidth &&
      0<= this.y && this.y < this.maxHeight;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
