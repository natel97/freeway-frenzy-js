export default interface Entity {
  id: number;
  x: number;
  y: number;
  image: HTMLImageElement;
  width: number;
  height: number;
  onDestroy: () => void;
  onCreate: () => void;
  step: (delta: number) => void;
  isTouched: boolean;
  drawTouch: (
    context: CanvasRenderingContext2D,
    gridW: number,
    gridH: number
  ) => void;
}
