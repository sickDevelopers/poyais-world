import {GameEntity} from "../abstract/ecs/game-entity";
import {PositionComponent} from "../components/position.component";
import {Vector} from "../abstract/geometry/vector";
import {BuildingStatsComponent, BuildingTypes} from "../components/building-stats.component";
import {ExportEntity, World} from "../world";
import {WorldRefComponent} from "../components/world-ref.component";

export interface TavernOptions {
    position: Vector,
    name:string
}

export class Tavern extends GameEntity {

    constructor(world:World, options:TavernOptions) {
        super();

        const positionComponent = new PositionComponent(options.position.x, options.position.y);

        this.addComponent(positionComponent)
            .addComponent(new BuildingStatsComponent(BuildingTypes.TAVERN, options.name))
            .addComponent(new WorldRefComponent(world))

    }

    export():ExportEntity {
        const positionComponent = <PositionComponent>this.getComponent('POSITION');
        const buildingStats = <BuildingStatsComponent>this.getComponent('BUILDING-STATS');

        const exportEntity:ExportEntity = {
            id: this.id,
            name: buildingStats.buildingName,
            type: 'tavern',
            position: [positionComponent.position.x, positionComponent.position.y],
        }

        return exportEntity;

    }

    print() {
    }

}