import '../css/Resister.css';
import {useState} from "react";
import axios from "axios";

const Resister = ({selectedData, onEventInMarketCancel}) => {
    const animalData = selectedData && selectedData.animal;
    const [price, setPrice] = useState('');
    let animalBuff = useState(0)
    const accessToken = localStorage.getItem('accessToken');

    if (!animalBuff === 0){
        animalBuff = animalData.buff // 만약 buff 가 0이 아니면 buff값을 그대로 저장
    }

    const itemInfo = {
        itemId: animalData.animalId,
        name: animalData.name,
        grade: animalData.grade,
        species: animalData.species,
        buff: animalBuff[0], // 배열에서 첫 번째 값을 선택하여 정수로 변환하여 보냄
        price: price
    };

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
        axios.post(`http://localhost:8000/api/v1/inventory/delete`, itemInfo, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(()=>{
                alert("삭제성공")
            }).catch((err)=>{
            console.log(err)
        })
    }

    return <>
        <div className="register-container">
            <div className="register-wrap">
                <div className="register-wrap-item">
                    {/*    아이템 이미지 등록 */}
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