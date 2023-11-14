import React, {useEffect, useRef, useState} from "react";
import "../css/MarketInven.css";
import axios from "axios";

const MarketInven = () => {

    useEffect(() => {
        const animalButton = document.querySelector('.marketinven-section-animalBtn');
        const buildingButton = document.querySelector('.marketinven-section-buildingBtn');
        const container = document.querySelector('.marketinven-container');
    //
    //     axios.get("http://localhost:8000/api/v1/inventory/animals", {
    //         headers: {
    //             Authorization: `Bearer <여기에_토큰을_넣어주세요>`
    //         }
    //     })
    //         .then((response) => {
    //             console.log("데이터 불러오기 성공: ", response.data);
    //             nav('/draw/result', { state: response.data });
    //         })
    //         .catch((error) => {
    //             console.error("데이터 가져오기 실패: ", error);
    //         });
    //
    //     axios.get("http://localhost:8000/api/v1/inventory/buildings") // 건물버튼 눌렀을때 건물데이터 가져오기
    //         .then((response) => {
    //             console.log("loading data : ", response.data);
    //             nav('/draw/result', { state: response.data });
    //         })
    //         .catch((error) => {
    //             console.error("데이터 가져오기 실패: ", error);
    //         });


        // 동물 버튼을 클릭했을 때의 동작
        animalButton.addEventListener('click', function() {
            container.style.backgroundColor = '#A3FFF9';
        });

        // 건물 버튼을 클릭했을 때의 동작
        buildingButton.addEventListener('click', function() {
            container.style.backgroundColor = '#FFD1FA';
        });
    }, []);

    return <>
        <div className="marketinven-container">
            <div className="marketinven-section-title">
                <button className="marketinven-section-animalBtn">동물</button>
                <button className="marketinven-section-buildingBtn">건물</button>
            </div>
            <div className="marketinven-section-sell">
                <button className="marketinven-section-sellBtn">판매하기</button>
            </div>
            <div className="marketinven-section">
                <div className="marketinven-wrap">
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                </div>
                <div className="marketinven-wrap">
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                </div>
                <div className="marketinven-wrap">
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                </div>
                <div className="marketinven-wrap">
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                    <div className="marketinven-content">1</div>
                </div>
                <div className="marketinven-page">
                    <button className="marketinven-pageBtn">1</button>
                    <button className="marketinven-pageBtn">1</button>
                    <button className="marketinven-pageBtn">1</button>
                </div>
            </div>
        </div>
    </>;
};


export default MarketInven;
// 마켓 안에서 인벤토리