import { RefObject } from "react";

function render(
  pastTime: number,
  assets: Map<string, HTMLImageElement>,
  context?: CanvasRenderingContext2D | null
) {
  window.requestAnimationFrame((time) =>
    gameLoop(time - pastTime, assets, context)
  );
}

export function beginLoop(
  ref: RefObject<HTMLCanvasElement>,
  assets: Map<string, HTMLImageElement>
) {
  const context = ref.current?.getContext("2d");
  render(0, assets, context);
}

function gameLoop(
  time: number,
  assetMap: Map<string, HTMLImageElement>,
  context: CanvasRenderingContext2D | null = null,
  showGrid = false
) {
  if (!context) {
    return render(time, assetMap, context);
  }

  context.fillStyle = "#FFF";
  const { width, height } = getScreenSize();
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#FA3";
  const img = assetMap.get("background");
  if (img) {
    context.drawImage(img, 0, 0, width, height);
  }

  if (showGrid) {
    renderGrid(context);
  }
  render(time, assetMap, context);
}

function getScreenSize(maintainAspectRatio = true) {
  const ratio = 16 / 9;
  const heightIsRoot = window.innerWidth * 9 > window.innerHeight * 16;
  if (maintainAspectRatio) {
    if (heightIsRoot) {
      return { width: window.innerHeight * ratio, height: window.innerHeight };
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

function renderGrid(context: CanvasRenderingContext2D) {
  const { height, width } = getScreenSize();
  const [xLines, yLines] = [12, 8];
  const gridWidth = width / xLines;
  const gridHeight = height / yLines;
  context.strokeStyle = "#F24";

  for (let i = 0; i < xLines; i++) {
    context.beginPath();
    context.moveTo(i * gridWidth, 0);
    context.lineTo(i * gridWidth, height);
    context.stroke();
  }

  for (let i = 0; i < yLines; i++) {
    context.beginPath();
    context.moveTo(0, i * gridHeight);
    context.lineTo(width, i * gridHeight);
    context.stroke();
  }
}
