import '../css/BattlePointReward.css';
import giftbox from '../imgs/GIFTBOX 1.png';

const BattlePointReward = () => {
    return (
        <>
            <div className="rewardContainer">
                <div className="title__container">
                    <img src={giftbox}></img>
                    <div className="title">배틀포인트순 랭킹보상</div>
                </div>
                <p className="content">1위 : 무료뽑기 15회</p>
                <p className="content">2위 : 무료뽑기 10회</p>
                <p className="content">3위 : 무료뽑기 5회</p>
            </div>
        </>
    );
};

export default BattlePointReward;
