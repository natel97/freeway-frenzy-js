import Entity from "../Entity";

export default interface Destroyable extends Entity {
  health: number;
  onHit: () => void;
}
