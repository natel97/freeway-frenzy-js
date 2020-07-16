import React, { useRef, useEffect, useState } from "react";
import images from "./Assets/Images";
import GameLogic from "./Logic";
import Images from "./Assets/Images";

function loadAssets() {
  const assetMap = new Map<keyof typeof images, HTMLImageElement>();
  Object.keys(images).forEach((name) => {
    const el = document.createElement("img");
    el.src = images[name as keyof typeof Images];
    assetMap.set(name as keyof typeof Images, el);
  });
  return assetMap;
}

export default () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [assets] = useState(loadAssets());
  const [startGame, setStartGame] = useState(false);
  const [, setGame] = useState<GameLogic>();
  const [{ width, height }, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (ref && ref.current && startGame) {
      const g = new GameLogic(assets, ref);
      setGame(g);
      g.beginLoop();
    }
  }, [ref, assets, startGame]);
  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return startGame ? (
    <canvas ref={ref} width={width - 10} height={height - 10} />
  ) : (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <h2>Freeway Frenzy</h2>
      <div onClick={() => setStartGame(true)}>Start</div>
    </div>
  );
};
