export default interface Entity {
  id: number;
  x: number;
  y: number;
  image: HTMLImageElement;
  width: number;
  height: number;
  onDestroy: () => {};
  onCreate: () => {};
  step: () => {};
}
