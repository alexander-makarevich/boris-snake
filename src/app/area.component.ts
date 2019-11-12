import { Component, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import {UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW} from '@angular/cdk/keycodes';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-area',
  template: `<canvas #canvas [width]="squareSidePx * maxWidth" [height]="squareSidePx * maxHeight"></canvas>`,
  styles: ['canvas { border-style: solid }']
})
export class AreaComponent implements OnDestroy, AfterViewInit {
  @ViewChild('canvas', { static: false }) 
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private keyUps = fromEvent(document, 'keyup');
  readonly maxWidth = 30;
  readonly maxHeight = 15;
  readonly squareSidePx = 10;

  private x = 0;
  private y = 0;
  private subscription;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, this.squareSidePx, this.squareSidePx);

    this.subscription = this.keyUps.subscribe((event: KeyboardEvent) => {
      console.log(event.keyCode);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
