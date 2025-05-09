import React, {useEffect, useRef, useState} from "react";
import "../css/MarketInven.css";
import {api} from "../../../network/api";
const INVImg = `${process.env.PUBLIC_URL}/objectImgs`;

const MarketInven = ({onEventInMarketInven}) => {
    const [data, setData] = useState([]); 
    const itemsPerRow = 3;
    const containerRef = useRef();
    const accessToken = localStorage.getItem('accessToken');
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => { // todo: image에 onClick걸어야 할거같다.
        setSelectedItem(item);
    };
    const onClickSell = () => {
        onEventInMarketInven(selectedItem)
    }

    const fetchData = (type) => {
        let url = '';
        if (type === 'animals') {
            url = '/api/v1/inventory/animals';
            containerRef.current.style.backgroundColor = '#A3FFF9';
        } else if (type === 'buildings') {
            url = '/api/v1/inventory/buildings';
            containerRef.current.style.backgroundColor = '#FFD1FA';
        }
        const fetchItemData = async () => {
            try {
                const { data: response } = await api(url, 'GET', null, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setData(response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchItemData();
    };

    useEffect(() => {
        fetchData('animals'); // 초기 렌더링 시 동물 데이터 가져오기
    }, []); // 빈 배열을 제거하고 필요한 의존성 배열을 추가해도 좋을 것 같아요.

    const rows = [];
    for (let i = 0; i < data.length; i ++) {
        rows.push(data.slice(i * itemsPerRow, 3 + (i * itemsPerRow)));
    }


    return (
        <div className="marketinven-container" ref={containerRef}>
            <div className="marketinven-section-title">
                <button onClick={() => fetchData('animals')} className="marketinven-section-animalBtn">동물</button>
                <button onClick={() => fetchData('buildings')} className="marketinven-section-buildingBtn">건물</button>
            </div>
            <div className="marketinven-section-sell">
                <button onClick={onClickSell} className="marketinven-section-sellBtn">판매하기</button>
            </div>

            <div className="marketinven-section">
                {rows.map((row, rowIndex) => (
                    <div className="marketinven-wrap" key={rowIndex} >
                        {row.map((item, index) => (
                            <div
                                className={`marketinven-content ${selectedItem === item ? 'selected' : ''}`}
                                key={index}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.animal ? (
                                    <img className="marketinven-content-image" src={`${INVImg}/animals/${item.animal.species}/${item.animal.imagePath}`} alt={item.name} />
                                ) : (
                                    <img className="marketinven-content-image" src={`${INVImg}/buildings/${item.building.imagePath}`} alt={item.name} />
                                )}
                                <div>{item.ownedQuantity}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketInven;