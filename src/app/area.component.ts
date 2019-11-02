import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-area',
  template: `<canvas #canvas width="300" height="150"></canvas>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class AreaComponent  {
  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
}
