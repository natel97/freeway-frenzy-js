import { getGridSizes } from "..";
import Entity from "../Entity/Entity";

export default class {
  constructor(private ref: HTMLCanvasElement) {
    this.context = ref.getContext("2d");
    ref.addEventListener("mousedown", this.mouseStart.bind(this));
    ref.addEventListener("touchstart", this.touchStart.bind(this));
    ref.addEventListener("mouseup", this.handleEnd.bind(this));
    ref.addEventListener("touchend", this.handleEnd.bind(this));
    ref.addEventListener("touchmove", this.touchMove.bind(this));
    ref.addEventListener("mousemove", this.mouseMove.bind(this));
  }
  lastX = 0;
  lastY = 0;
  radius = getGridSizes().gridWidth / 4;
  isTouch = false;
  context: CanvasRenderingContext2D | null;
  itemsTouched: Entity[] = [];
  gridW = 0;
  gridH = 0;

  draw() {
    if (!this.isTouch || this.context === null) {
      return;
    }

    this.context.beginPath();
    this.context.strokeStyle = "#FFF";
    this.context.arc(this.lastX, this.lastY, this.radius, 0, 2 * Math.PI);
    this.context.fill();
    this.itemsTouched.forEach(
      (item) =>
        this.context && item.drawTouch(this.context, this.gridW, this.gridH)
    );
  }

  private mouseStart(event: MouseEvent) {
    const { gridWidth, gridHeight } = getGridSizes(true);
    this.gridW = gridWidth;
    this.gridH = gridHeight;
    this.isTouch = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
  }

  private touchStart(event: TouchEvent) {
    this.isTouch = true;
    this.lastX = event.touches[0].clientX;
    this.lastY = event.touches[0].clientY;
  }

  private handleEnd(event: MouseEvent | TouchEvent) {
    this.isTouch = false;
    if (this.itemsTouched.length) {
      this.itemsTouched = [this.itemsTouched[this.itemsTouched.length - 1]];
    }
  }

  private touchMove(event: TouchEvent) {
    this.itemsTouched.forEach((e) => (e.isTouched = false));
    this.lastX = event.touches[0].clientX;
    this.lastY = event.touches[0].clientY;
  }

  private mouseMove(event: MouseEvent) {
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
  }

  private getTouched(entity: Entity) {
    this.context?.beginPath();
    if (!this.isTouch || this.itemsTouched.find((x) => x.id === entity.id))
      return;
    if (
      this.isTouchingPosition(entity.x, entity.y, entity.width, entity.height)
    ) {
      this.itemsTouched.push(entity);
    }
  }

  getIfItemTouched = this.getTouched.bind(this);

  isTouchingPosition(x: number, y: number, width: number, height: number) {
    return (
      x * this.gridW < this.lastX + this.radius &&
      y * this.gridH < this.lastY + this.radius &&
      (x + width) * this.gridW + this.radius > this.lastX &&
      (y + height) * this.gridH + this.radius > this.lastY
    );
  }
}
