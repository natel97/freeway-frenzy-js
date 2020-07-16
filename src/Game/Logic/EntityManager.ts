import Entity from "./Entity/Entity";
import { getGridSizes } from ".";

export class EntityManager<T extends Entity> {
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

  renderEntities(
    context: CanvasRenderingContext2D,
    delta: number,
    collisionBox = false
  ) {
    const { gridWidth, gridHeight } = getGridSizes();
    this.entities.forEach((entity) => {
      const x = entity.x * gridWidth;
      const y = entity.y * gridWidth;
      const width = entity.width * gridWidth;
      const height = entity.height * gridHeight;
      entity.step(delta);
      if (collisionBox) {
        context.strokeRect(x, y, width, height);
      }
      context.drawImage(entity.image, x, y, width, height);
    });
  }
}
