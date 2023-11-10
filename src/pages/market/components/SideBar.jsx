import React, { useState } from "react";
import "../css/SideBar.css";

const SideBar = () => {
    // 각 버튼의 클릭 상태를 별도로 관리
    const [normalClicked, setNormalClicked] = useState(false);
    const [rareClicked, setRareClicked] = useState(false);
    const [superRareClicked, setSuperRareClicked] = useState(false);
    const [uniqueClicked, setUniqueClicked] = useState(false);
    const [legendClicked, setLegendClicked] = useState(false);
    const [priceHighClicked, setPriceHighClicked] = useState(false);
    const [priceLowClicked, setPriceLowClicked] = useState(false);

    // 클릭 시 해당 버튼의 클릭 상태를 토글
    const toggleNormalClicked = () => setNormalClicked(!normalClicked);
    const toggleRareClicked = () => setRareClicked(!rareClicked);
    const toggleSuperRareClicked = () => setSuperRareClicked(!superRareClicked);
    const toggleUniqueClicked = () => setUniqueClicked(!uniqueClicked);
    const toggleLegendClicked = () => setLegendClicked(!legendClicked);

    const togglePriceHighClicked = () => {
        setPriceHighClicked(!priceHighClicked);
        setPriceLowClicked(false); // 가격 낮은 순 클릭 해제
    };

    const togglePriceLowClicked = () => {
        setPriceLowClicked(!priceLowClicked);
        setPriceHighClicked(false); // 가격 높은 순 클릭 해제
    };

    return (
        <>
            <div>
                <div className={`sidebar-container ${normalClicked ? "clicked" : ""}`}>
                    <div className="sidebar-container-grade">
                        <div className="sidebar-grade-content">
                            <a
                                href="#"
                                onClick={toggleNormalClicked}
                                    className={`sidebar-grade-contentBtn${
                                    normalClicked ? " clicked" : ""
                                }`}
                            >
                                노말
                            </a>
                            <a
                                href="#"
                                onClick={toggleRareClicked}
                                className={`sidebar-grade-contentBtn${
                                    rareClicked ? " clicked" : ""
                                }`}
                            >
                                레어
                            </a>
                            <a
                                href="#"
                                onClick={toggleSuperRareClicked}
                                className={`sidebar-grade-contentBtn${
                                    superRareClicked ? " clicked" : ""
                                }`}
                            >
                                슈퍼레어
                            </a>
                            <a
                                href="#"
                                onClick={toggleUniqueClicked}
                                className={`sidebar-grade-contentBtn${
                                    uniqueClicked ? " clicked" : ""
                                }`}
                            >
                                유니크
                            </a>
                            <a
                                href="#"
                                onClick={toggleLegendClicked}
                                className={`sidebar-grade-contentBtn${
                                    legendClicked ? " clicked" : ""
                                }`}
                            >
                                레전드
                            </a>
                        </div>
                    </div>
                    <div className="sidebar-container-grade">
                        <div className="sidebar-orderBy-wrap">
                            <a
                                href="#"
                                onClick={togglePriceHighClicked}
                                className={`sidebar-orderBy${
                                    priceHighClicked ? " clicked" : ""
                                }`}
                            >
                                가격 높은 순
                            </a>
                            <a
                                href="#"
                                onClick={togglePriceLowClicked}
                                className={`sidebar-orderBy${
                                    priceLowClicked ? " clicked" : ""
                                }`}
                            >
                                가격 낮은 순
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;