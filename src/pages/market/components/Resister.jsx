import '../css/Resister.css';
import {useState} from "react";

const Resister = ({selectedData, onEventInMarketCancel}) => {
    const [price, setPrice] = useState('');
    const onChangePrice = (e) => {
        const inputPrice = e.target.value;
        if (isNaN(inputPrice)) {
            alert("숫자만 입력하시오.");
            setPrice(''); // 입력값을 비워줌
        } else {
            setPrice(inputPrice); // 숫자인 경우에만 값을 변경
        }
    }

    const onClickCancel = () =>{
        onEventInMarketCancel()
    }
    const ItemSell = () => {
        // market controller에 insert , UUID userId, Long itemId,  String name, String grade,  String type, Integer buff, Integer price < reqeust
        // user inven delete
    }

    const animalData = selectedData && selectedData.animal;

    return <>
        <div className="register-container">
            <div className="register-wrap">
                <div className="register-wrap-item">
                    {/*    아이템 등록 구간*/}
                </div>
                <div>
                    이름 : {animalData.name}
                </div>
                <div>
                    등급 : {animalData.grade}
                </div>
                <div>
                    강화 수 : {selectedData.upgrade}
                </div>
                <div>
                    <input onChange={onChangePrice} value={price} className="register-wrap-input" placeholder="판매 금액" />
                </div>
            </div>
            <div className="register-btnWrap">
                <button onClick={ItemSell} className="register-btn">등록하기</button>
                <button onClick={onClickCancel} className="register-btn">취소</button>
            </div>
        </div>
    </>;
};

export default Resister;