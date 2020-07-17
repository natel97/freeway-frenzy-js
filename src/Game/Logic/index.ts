import { RefObject } from "react";
import { EntityManager } from "./EntityManager";
import Destroyer from "./Entity/Destroyer";
import Destroyable from "./Entity/Destroyable";
import Images from "../Assets/Images";
import { destroyables, destroyers, damagers } from "./Entity/MacroMapper";
import TouchHandler from "./Handlers/TouchHandler";

export default class MainGame {
  destroyerManager = new EntityManager<Destroyer>();
  destroyableManager = new EntityManager<Destroyable>();
  context: CanvasRenderingContext2D;
  lastTime = 0;
  touchHandler: TouchHandler;

  constructor(
    private assets: Map<keyof typeof Images, HTMLImageElement>,
    private ref: RefObject<HTMLCanvasElement>
  ) {
    console.log(damagers(), destroyers());
    const context = this.ref.current?.getContext("2d");
    if (context === null || context === undefined) {
      throw new Error("Context not defined");
    }
    if (ref && ref.current) {
      this.touchHandler = new TouchHandler(ref.current);
    } else {
      throw new Error("No canvas");
    }
    setInterval(() => {
      destroyables().forEach((obj: any) => {
        const img = this.assets.get(obj.image);
        if (img) {
          const destroyable = new Destroyable(img);
          destroyable.x =
            obj.lanes[Math.floor(Math.random() * obj.lanes.length)];
          destroyable.y = 8;
          destroyable.health = obj.health;
          destroyable.width = obj.width;
          destroyable.height = obj.height;
          this.destroyableManager.createEntity(destroyable);
        } else {
          console.error({
            msg: "asset does not exist",
            asset: obj.image,
            object: obj,
          });
        }
      });
    }, 5000);

    this.context = context;
  }

  private render() {
    window.requestAnimationFrame(this.handleFrame.bind(this));
  }

  handleFrame(time: number) {
    this.gameLoop(time - (this.lastTime || time));
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
    this.destroyableManager.findEntities(this.touchHandler.getIfItemTouched);
    this.touchHandler.draw();
    this.coverBoundaries();
    this.render();
  }

  private renderBackground() {
    this.context.fillStyle = "#FFF";
    const { width, height } = getScreenSize();
    this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    const img = this.assets.get("background");
    if (img) {
      this.context.drawImage(img, 0, 0, width, height);
    }
  }

  coverBoundaries() {
    this.context.fillStyle = "#FFF";
    const { width, height } = getScreenSize();
    this.context.fillRect(width, 0, window.innerWidth, window.innerHeight);
    this.context.fillRect(0, height, window.innerWidth, window.innerHeight);
  }

  private renderGrid() {
    this.context.strokeStyle = "#F24";
    const {
      gridWidth,
      gridHeight,
      width,
      height,
      xLines,
      yLines,
    } = getGridSizes();

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

export function getScreenSize(maintainAspectRatio = true) {
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

export function getGridSizes(maintainAspectRatio = true) {
  const { height, width } = getScreenSize(maintainAspectRatio);
  const [xLines, yLines] = [12, 8];
  const gridWidth = width / xLines;
  const gridHeight = height / yLines;

  return { gridWidth, gridHeight, width, height, xLines, yLines };
}
