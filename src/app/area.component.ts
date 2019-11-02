import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-area',
  template: `<canvas #canvas width="300" height="150"></canvas>`,
  styles: ['canvas { border-style: solid }']
})
export class AreaComponent implements OnInit {
  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, 10, 10);
  }
}
