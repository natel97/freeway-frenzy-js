import Entity from "./Entity/Entity";

export class EntityManager<T extends Entity> {
  constructor() {}

  private lastId = 0;
  private entities: T[] = [];

  private getNextId() {
    return this.lastId++;
  }

  createEntity(entity: T) {
    entity.id = this.getNextId();
    this.entities.push(entity);
    return entity.id;
  }

  findEntities(whereFunc: (entity: Entity) => {}): Entity[] {
    return this.entities.filter(whereFunc);
  }

  destroyEntity(id: number) {
    const entity = this.entities.find((e) => e.id === id);
    entity?.onDestroy();
    this.entities = this.entities.filter((e) => e.id !== id);
  }

  renderEntities(context: CanvasRenderingContext2D) {
    this.entities.forEach((entity) => {
      entity.step();
      context.drawImage(
        entity.image,
        entity.x,
        entity.y,
        entity.width,
        entity.height
      );
    });
  }
}
