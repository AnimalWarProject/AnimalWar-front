import React, {useEffect, useRef, useState} from "react";
import "../css/MarketInven.css";
import axios from "axios";

const MarketInven = () => {
    const [data, setData] = useState([]); // 건물, 동물 데이터
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const containerRef = useRef();
    const accessToken = localStorage.getItem('accessToken');

    const fetchData = (type) => {
        let url = '';
        if (type === 'animals') {
            url = "http://localhost:8000/api/v1/inventory/animals";
            containerRef.current.style.backgroundColor = '#A3FFF9';
        } else if (type === 'buildings') {
            url = "http://localhost:8000/api/v1/inventory/buildings";
            containerRef.current.style.backgroundColor = '#FFD1FA';
        }

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.data !== null) {
                    setData(response.data);
                }
            })
            .catch((error) => {
                console.log('데이터 가져오기 실패 : ', error);
            });
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
                <button className="marketinven-section-sellBtn">판매하기</button>
            </div>
            <div className="marketinven-section">
                {rows.map((row, rowIndex) => (
                    <div className="marketinven-wrap" key={rowIndex}>
                        {row.map((item, index) => (
                            <div className="marketinven-content" key={index}>
                                <div>{item.animal ? item.animal.name : item.building.name}</div> {/* todo: 이름대신 이미지 */}
                                <div>{item.animal ? item.ownedQuantity : item.ownedQuantity}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketInven;