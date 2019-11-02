import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import {UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW} from '@angular/cdk/keycodes';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-area',
  template: `<canvas #canvas width="300" height="150"></canvas>`,
  styles: ['canvas { border-style: solid }']
})
export class AreaComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private keyUps = fromEvent(document, 'keyup');
  private x = 0;
  private y = 0;
  private subscription;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, 10, 10);

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

      this.ctx.clearRect(0, 0, 300, 150);

      this.ctx.fillRect(this.x * 10, this.y * 10, 10, 10);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
