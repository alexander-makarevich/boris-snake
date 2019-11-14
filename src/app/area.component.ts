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

/**
 * head of the snake is the first unit
 */
class Snake {
  constructor(public units: SnakeUnit[]) {
  }

  private headAtNextStep(direction: Direction): SnakeUnit {
    const head: SnakeUnit = this.units[0];

    let unit: SnakeUnit;
    switch(direction) {
      case Direction.Up: unit = {x: head.x, y: head.y - 1}; break;
      case Direction.Down: unit = {x: head.x, y: head.y + 1}; break;
      case Direction.Left: unit = {x: head.x - 1, y: head.y}; break;
      case Direction.Right: unit = {x: head.x + 1, y: head.y}; break;
    }

    const second: SnakeUnit = this.units[1];
    if (second.x === unit.x && second.y === unit.y) {
      unit = {x: head.x + (head.x - second.x), y: head.y + (head.y - second.y)};
    }

    return unit;
  }

  move(direction: Direction) {
    const unit: SnakeUnit = this.headAtNextStep(direction);
    this.units.unshift(unit);
    this.units.pop();
  }
}

/**
 * max is not included at the range
 */
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

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

  private subscription;
  private snake: Snake = new Snake([{x: 10, y: 7}, {x: 11, y: 7}, {x: 12, y: 7}]);
  private apple: SnakeUnit | null = null;

  drawSnake() {
    this.ctx.fillStyle = 'red';
    for(let unit of this.snake.units) {
      this.ctx.fillRect(unit.x * this.squareSidePx, unit.y * this.squareSidePx, this.squareSidePx, this.squareSidePx);
    }
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.drawSnake();
    this.addApple();
    this.drawApple();

    this.subscription = this.tick
      .pipe(withLatestFrom(this.keyUps))
      .subscribe(([tick, event]: [number, KeyboardEvent]) => {
        console.log('tick: ' + tick + event.keyCode);

        switch(event.keyCode) {
          case RIGHT_ARROW: this.snake.move(Direction.Right); break;
          case LEFT_ARROW: this.snake.move(Direction.Left); break;
          case UP_ARROW: this.snake.move(Direction.Up); break;
          case DOWN_ARROW: this.snake.move(Direction.Down); break;
        }

        this.ctx.clearRect(0, 0, this.squareSidePx * this.maxWidth, this.squareSidePx * this.maxHeight);

        this.drawSnake();
        this.drawApple();
      });
  }

  check(): boolean {
    const head = this.snake.units[0];
    return 0 <= head.x && head.x < this.maxWidth &&
      0<= head.y && head.y < this.maxHeight;
  }

  addApple() {
    const x: number = getRandomInt(this.maxWidth);
    const y: number = getRandomInt(this.maxHeight);
    this.apple = {x, y};
  }

  drawApple() {
    if (this.apple === null) return ;

    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(
      this.apple.x * this.squareSidePx,
      this.apple.y * this.squareSidePx,
      this.squareSidePx, this.squareSidePx);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
