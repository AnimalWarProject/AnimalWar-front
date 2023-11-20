import '../css/Resister.css';
import {useState} from "react";
import axios from "axios";

const Resister = ({selectedData, onEventInMarketCancel}) => {
    let data; // data 변수를 선언
    let dataToSend;
    if (selectedData.animal) {
        data = selectedData.animal;
    } else {
        data = selectedData.building;
    }
    const [price, setPrice] = useState('');
    const [buff, setBuff] = useState(0); // buff 상태를 useState로 초기화
    const accessToken = localStorage.getItem('accessToken');

    //todo : data가  selectedData.animal 일때

    if (buff !== 0){
        setBuff(selectedData.upgrade);
    }
    const animalInfo = {
        itemId: data.animalId,
        name: data.name,
        grade: data.grade,
        attackPower:data.attackPower,
        defencePower:data.defencePower,
        life:data.life,
        species: data.species,
        imagePath:data.imagePath,
        buff: buff, // 동물 강화 수
        price: price
    };

    //todo : data가 selectedData.building 일 때  axios 나눠야함

    const buildingInfo = {
        itemId: data.buildingId,
        name: data.name,
        grade: data.grade,
        attackPower: data.attackPower,
        defencePower: data.defencePower,
        life: data.life,
        woodRate: data.woodRate,
        ironRate: data.ironRate,
        foodRate: data.foodRate,
        imagePath: data.imagePath,
        buildingType:data.buildingType,
        price: price
    };

    if (animalInfo) {
        dataToSend = animalInfo;
    } else if (buildingInfo) {
        dataToSend = buildingInfo;
    } else {
        alert("올바르지 않은 정보입니다.")
    }

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
        if (selectedData.animal) {
            axios.post(`http://localhost:8000/api/v1/inventory/delete/animal`, animalInfo, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(()=>{
                    alert("삭제성공")
                })
                .catch((err)=>{
                    console.log(err)
                })
        } else if (selectedData.building) {
            axios.post(`http://localhost:8000/api/v1/inventory/delete/building`, buildingInfo, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(()=>{
                    alert("삭제성공")
                })
                .catch((err)=>{
                    console.log(err)
                })
        } else {
            alert("올바르지 않은 정보입니다.")
        }
    }

    return <>
        <div className="register-container">
            <div className="register-wrap">
                <div className="register-wrap-item">
                    {/*    아이템 이미지 등록 */}
                </div>
                <div>
                    이름 : {data.name}
                </div>
                <div>
                    등급 : {data.grade}
                </div>
                <div>
                    강화 수 : {selectedData.upgrade ? selectedData.upgrade : 0 }
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