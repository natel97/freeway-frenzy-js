import Destroyable from "./index";

export default class implements Destroyable {
  constructor(image: HTMLImageElement) {
    this.image = image;
    this.y = 1000;
  }

  health = 10;
  onHit = () => {
    console.log(this);
  };

  id = 10;
  x = 128;
  y = 3000;
  width = 92;
  height = 148;
  image: HTMLImageElement;
  onDestroy = () => {
    console.log(this);
  };
  onCreate = () => {
    console.log(this);
  };
  step = (delta: number) => {
    this.y -= delta / 10;
  };
}
