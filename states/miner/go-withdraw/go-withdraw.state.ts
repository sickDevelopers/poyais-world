import {IState} from "../../../abstract/fsm/state";
import {Miner} from "../../../entities/miner";
import {Telegram} from "../../../abstract/messaging/telegram";
import {PositionComponent} from "../../../components/position.component";
import {MovementComponent} from "../../../components/movement.component";
import {Vector} from "../../../abstract/geometry/vector";
import {BuildingTypes} from "../../../components/building-stats.component";
import {WalkingTo} from "../walking/walking-to.state";
import {StateMachineComponent} from "../../../components/state-machine.component";
import {HasMoneyToSpendComponent} from "../../../components/has-money-to-spend.component";
import {Bank} from "../../../entities/bank";
import {GoRest} from "../go-rest/go-rest";
import {DiedState} from "../died.state";
import {GoMiningState} from "../go-mining/go-mining.state";

export class GoWithdraw extends WalkingTo implements IState {

    name = "GoWithdraw";


    enter(entity:Miner) {
        const bank = entity.locateClosestBuilding(BuildingTypes.BANK);
        (<MovementComponent>entity.getComponent("MOVEMENT")).seekOn(bank);
    }

    execute(entity:Miner) {
        this.walk(entity);

        // is it close to tavern? go drinking
        const positionComponent = <PositionComponent>entity.getComponent('POSITION');
        const movementComponent = <MovementComponent>entity.getComponent('MOVEMENT');

        if (movementComponent.seekTarget && Vector.distance(movementComponent.seekTarget, positionComponent.position) < 1) {

            const hasMoneyComponent = <HasMoneyToSpendComponent>entity.getComponent('MONEY-TO-SPEND');
            const withdrawRes= Bank.withdrawFromAccount(entity.id, 50);

            const stateMachineComponent = <StateMachineComponent>entity.getComponent('STATE-MACHINE');

            if (!withdrawRes) {
                // CAPITALISM AT IT'S FINEST, if it doesn't have a bank account
                stateMachineComponent.getFSM().changeGlobalState(new DiedState());
                return;
            }

            hasMoneyComponent.money += withdrawRes.withdraw;

            if (withdrawRes.newAmount < 50) {
                // go home bitch
                stateMachineComponent.getFSM().changeState(new GoMiningState())
            } else {
                // return to previous state

                stateMachineComponent.getFSM().revert();
            }



        }
    }

    exit(entity:Miner) {
    }

    onMessage(owner:any, telegram:Telegram):boolean {
        return true;
    }

}