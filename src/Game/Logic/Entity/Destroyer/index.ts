import Entity from "../Entity";

export default interface Destroyer extends Entity {
  health: number;
  onFire: () => {};
}
