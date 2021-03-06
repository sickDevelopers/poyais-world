import {IState, State} from "../../../abstract/fsm/state";
import {Miner} from "../../../entities/miner";
import {Telegram} from "../../../abstract/messaging/telegram";
import {HumanStatsComponent} from "../../../components/human-stats.component";
import {WorldRefComponent} from "../../../components/world-ref.component";

export class WalkingTo extends State implements IState {

    name = "WalkingTo";

    enter(entity:Miner) {
    }

    execute(entity:Miner) {
    }

    exit(entity:Miner) {
    }

    walk(entity:Miner) {
        const worldComponent = <WorldRefComponent>entity.getComponent('WORLD-REF');
        const delta = worldComponent.world.frame.deltaTime;
        const humanStats = <HumanStatsComponent>entity.getComponent('HUMAN-STATS');

        humanStats.fatigue += 2 * delta;
        humanStats.boredom = Math.max(0, humanStats.boredom - (1 * delta));
        humanStats.thirst += 1 * delta;
    }

    onMessage(owner:any, telegram:Telegram):boolean {
        return true;
    }

}