import BattlePoint from "./BattlePoint";
import Power from "./Power";
import "../css/RankContainer.css"
import Gold from "./Gold";
import BattlePointReward from "./BattlePointReward";
import Notice from "./Notice";

const Rank = () => {



    return (<>
        <div className="rankContainer">

            <BattlePoint></BattlePoint>
            <Power></Power>
            <Gold></Gold>
            <div className="horizonContainer">
                <BattlePointReward></BattlePointReward>
                <Notice></Notice>
            </div>

        </div>

    </>)
}



export default Rank;