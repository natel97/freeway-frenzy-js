import React, { useRef, useEffect, useState } from "react";
import images from "./Assets/Images";
import { beginLoop } from "./Logic";

function loadAssets() {
  const assetMap: Map<string, HTMLImageElement> = new Map<
    string,
    HTMLImageElement
  >();
  Object.keys(images).forEach((name) => {
    const el = document.createElement("img");
    el.src = images[name as keyof typeof images];
    assetMap.set(name, el);
  });
  return assetMap;
}

export default () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [assets] = useState(loadAssets());
  const [{ width, height }, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    if (ref && ref.current) {
      beginLoop(ref, assets);
    }
  }, [ref, assets]);
  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return <canvas ref={ref} width={width - 10} height={height - 10} />;
};
