import Entity from "../Entity";

export default class Destroyable implements Entity {
  constructor(image: HTMLImageElement) {
    this.image = image;
    this.y = 1000;
  }

  health = 10;
  onHit = () => {
    console.log(this);
  };

  id = 10;
  x = 3;
  y = 8;
  width = 1;
  height = 1.5;
  image: HTMLImageElement;
  onDestroy = () => {
    console.log(this);
  };
  onCreate = () => {
    console.log(this);
  };
  step = (delta: number) => {
    this.y -= delta / 1000;
  };
}
