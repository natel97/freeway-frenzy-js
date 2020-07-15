import { RefObject } from "react";
import { EntityManager } from "./EntityManager";
import Destroyer from "./Entity/Destroyer";
import Destroyable from "./Entity/Destroyable";
import Car from "./Entity/Destroyable/Car";
import Images from "../Assets/Images";

export default class MainGame {
  destroyerManager = new EntityManager<Destroyer>();
  destroyableManager = new EntityManager<Destroyable>();
  context: CanvasRenderingContext2D;
  lastTime = 0;

  constructor(
    private assets: Map<keyof typeof Images, HTMLImageElement>,
    private ref: RefObject<HTMLCanvasElement>
  ) {
    const context = this.ref.current?.getContext("2d");
    if (context === null || context === undefined) {
      throw new Error("Context not defined");
    }
    this.context = context;

    const { height } = this.getScreenSize(true);

    const img = this.assets.get("car");
    if (img) {
      const car = new Car(img);
      car.x = 128;
      car.y = height;
      this.destroyableManager.createEntity(car);
    }
  }

  private render() {
    window.requestAnimationFrame(this.handleFrame.bind(this));
  }

  handleFrame(time: number) {
    this.gameLoop(time - this.lastTime);
    this.lastTime = time;
  }

  public beginLoop() {
    this.render();
  }

  private gameLoop(time: number, showGrid = true) {
    this.renderBackground();
    this.context.fillStyle = "#FA3";
    if (showGrid) {
      this.renderGrid();
    }
    this.destroyableManager.renderEntities(this.context, time);
    this.destroyerManager.renderEntities(this.context, time);

    this.destroyableManager
      .findEntities((entity) => entity.y < -entity.height)
      .forEach((e) => this.destroyableManager.destroyEntity(e.id));

    this.coverBoundaries();
    this.render();
  }

  private renderBackground() {
    this.context.fillStyle = "#FFF";
    const { width, height } = this.getScreenSize();
    this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    const img = this.assets.get("background");
    if (img) {
      this.context.drawImage(img, 0, 0, width, height);
    }
  }

  coverBoundaries() {
    this.context.fillStyle = "#FFF";
    const { width, height } = this.getScreenSize();
    this.context.fillRect(width, 0, window.innerWidth, window.innerHeight);
    this.context.fillRect(0, height, window.innerWidth, window.innerHeight);
  }

  public getScreenSize(maintainAspectRatio = true) {
    const ratio = 16 / 9;
    const heightIsRoot = window.innerWidth * 9 > window.innerHeight * 16;
    if (maintainAspectRatio) {
      if (heightIsRoot) {
        return {
          width: window.innerHeight * ratio,
          height: window.innerHeight,
        };
      } else {
        return {
          height: window.innerWidth / ratio,
          width: window.innerWidth,
        };
      }
    } else {
      return { width: window.innerWidth, height: window.innerWidth };
    }
  }

  private renderGrid() {
    const { height, width } = this.getScreenSize();
    const [xLines, yLines] = [12, 8];
    const gridWidth = width / xLines;
    const gridHeight = height / yLines;
    this.context.strokeStyle = "#F24";

    for (let i = 0; i < xLines; i++) {
      this.context.beginPath();
      this.context.moveTo(i * gridWidth, 0);
      this.context.lineTo(i * gridWidth, height);
      this.context.stroke();
    }

    for (let i = 0; i < yLines; i++) {
      this.context.beginPath();
      this.context.moveTo(0, i * gridHeight);
      this.context.lineTo(width, i * gridHeight);
      this.context.stroke();
    }
  }
}
