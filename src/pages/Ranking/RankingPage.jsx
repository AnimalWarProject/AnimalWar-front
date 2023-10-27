import BattlePoint from './components/BattlePoint';
import Power from './components/Power';
import './css/RankContainer.css';
import Gold from './components/Gold';
import BattlePointReward from './components/BattlePointReward';
import Notice from './components/Notice';

const RankingPage = () => {
    return (
        <>
            <div className="rankContainer">
                <BattlePoint></BattlePoint>
                <Power></Power>
                <Gold></Gold>
                <div className="horizonContainer">
                    <BattlePointReward></BattlePointReward>
                    <Notice></Notice>
                </div>
            </div>
        </>
    );
};

export default RankingPage;
