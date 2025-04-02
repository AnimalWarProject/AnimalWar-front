import '../css/Resister.css';
import {useEffect, useState} from "react";
import {api} from "../../../network/api";
const INVImg = `${process.env.PUBLIC_URL}/objectImgs`;

const Resister = ({selectedData, onEventInMarketCancel}) => {
    const accessToken = localStorage.getItem('accessToken');
    const [userInfo, setUserInfo] = useState({})
    let data; 
    let dataToSend;
    if (selectedData.animal) {
        data = selectedData.animal;
    } else {
        data = selectedData.building;
    }
    const [price, setPrice] = useState('');
    const [buff, setBuff] = useState(0); 

    useEffect( () => {
        const fetchUserData = async () => {
            try {
                const { data: INVdata } = await api(`/api/v1/user`, 'GET', null, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setUserInfo(INVdata);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };
        fetchUserData();
    }, []);

    if (buff !== 0){
        setBuff(selectedData.upgrade);
    }
    const animalInfo = {
        userid: userInfo.uuid,
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

    const buildingInfo = {
        userid: userInfo.uuid,
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
            setPrice('');
        } else {
            setPrice(inputPrice);
        }
    }
    const onClickCancel = () =>{
        onEventInMarketCancel()
    }
    const ItemSell = () => {
        if (selectedData.animal) {
            const fetchAimalInfo = async () => {
                try {
                    const { data: response } = await api(`/api/v1/inventory/delete/animal`, 'POST', animalInfo, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAimalInfo();

        } else if (selectedData.building) {

            const fetchAimalInfo = async () => {
                try {
                    const { data: response } = await api(`/api/v1/inventory/delete/building`, 'POST', buildingInfo, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAimalInfo();
        } else {
            alert("올바르지 않은 정보입니다.")
        }
        onEventInMarketCancel()
    }

    return <>
        <div className="register-container">
            <div className="register-wrap">
                <div className="register-wrap-item">
                    {selectedData.animal ? ( 
                        <img className="register-wrap-image" src={`${INVImg}/animals/${animalInfo.species}/${data.imagePath}`} alt="" />
                    ) : (
                        <img className="register-wrap-image" src={`${INVImg}/buildings/${data.imagePath}`} alt="" /> 
                    )}
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