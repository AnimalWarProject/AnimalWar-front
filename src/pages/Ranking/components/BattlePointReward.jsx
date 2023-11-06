
import '../css/BattlePointReward.css';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from "react";


const BattlePointReward = () => {

    const [giftBox, setGiftBox] = useState(null);

    const getGiftBox = async () => {
        const storage = getStorage();
        const searchImageRef = ref(storage, 'GIFTBOX 1.png');
        try {
            const url = await getDownloadURL(searchImageRef);
            setGiftBox(url);
        } catch (error) {
            console.error('Failed to fetch search image URL:', error);
        }
    }

    useEffect(() => {
        getGiftBox()
    }, [])


    return (
        <>
            <div className="rewardContainer">
                <div className="title__container">
                    <img src={giftBox}></img>
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
