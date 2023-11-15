import React, { useState } from 'react';
import '../css/SideBar.css';

const SideBar = ({ onSortSelect, onGradeSelect }) => {

    const handleAnimalTypeClick = (isSort) => {
        onSortSelect(isSort); // 이 부분이 수정되었습니다.
    };

    // 각 버튼의 클릭 상태를 별도로 관리
    const [normalClicked, setNormalClicked] = useState(false);
    const [rareClicked, setRareClicked] = useState(false);
    const [superRareClicked, setSuperRareClicked] = useState(false);
    const [uniqueClicked, setUniqueClicked] = useState(false);
    const [legendClicked, setLegendClicked] = useState(false);
    const [priceHighClicked, setPriceHighClicked] = useState(false);
    const [priceLowClicked, setPriceLowClicked] = useState(false);

    // 클릭 시 해당 버튼의 클릭 상태를 토글
    const toggleNormalClicked = () =>{
        if (!normalClicked) {
            setNormalClicked(true);
            onGradeSelect('NORMAL');
            setRareClicked(false);
            setSuperRareClicked(false);
            setUniqueClicked(false);
            setLegendClicked(false);
        } else {
            setNormalClicked(false);
            onGradeSelect('');
        }
    }
    const toggleRareClicked = () =>{
        if (!rareClicked) {
            setRareClicked(true);
            onGradeSelect('RARE')
            setNormalClicked(false);
            setSuperRareClicked(false);
            setUniqueClicked(false);
            setLegendClicked(false);
        } else {
            setRareClicked(false);
            onGradeSelect('');
        }
    }
    const toggleSuperRareClicked = () => {
        if (!superRareClicked) {
            setSuperRareClicked(true);
            onGradeSelect('SUPERRARE')
            setNormalClicked(false);
            setRareClicked(false);
            setUniqueClicked(false);
            setLegendClicked(false);
        } else {
            setSuperRareClicked(false);
            onGradeSelect('');
        }
    }
    const toggleUniqueClicked = () =>{
        if (!uniqueClicked){
            setUniqueClicked(true);
            onGradeSelect('UNIQUE')
            setNormalClicked(false);
            setRareClicked(false);
            setSuperRareClicked(false);
            setLegendClicked(false);
        }else {
            setUniqueClicked(false);
            onGradeSelect('');
        }
    }
    const toggleLegendClicked = () => {
        if (!legendClicked){
            setLegendClicked(true);
            onGradeSelect('LEGEND')
            setNormalClicked(false);
            setRareClicked(false);
            setSuperRareClicked(false);
            setUniqueClicked(false)
        }else {
            setLegendClicked(false);
            onGradeSelect('');
        }
    }

    const togglePriceHighClicked = () => {
        handleAnimalTypeClick('ASC')
        setPriceHighClicked(!priceHighClicked);
        setPriceLowClicked(false); // 가격 낮은 순 클릭 해제
    };

    const togglePriceLowClicked = () => {
        handleAnimalTypeClick('DESC')
        setPriceLowClicked(!priceLowClicked);
        setPriceHighClicked(false); // 가격 높은 순 클릭 해제
    };

    return (
        <>
            <div>
                <div className={`sidebar-container ${normalClicked ? 'clicked' : ''}`}>
                    <div className="sidebar-container-grade">
                        <div className="sidebar-grade-content">
                            <a
                                href="#"
                                onClick={toggleNormalClicked}
                                className={`sidebar-grade-contentBtn${normalClicked ? ' clicked' : ''}`}
                            >
                                노말
                            </a>
                            <a
                                href="#"
                                onClick={toggleRareClicked}
                                className={`sidebar-grade-contentBtn${rareClicked ? ' clicked' : ''}`}
                            >
                                레어
                            </a>
                            <a
                                href="#"
                                onClick={toggleSuperRareClicked}
                                className={`sidebar-grade-contentBtn${superRareClicked ? ' clicked' : ''}`}
                            >
                                슈퍼레어
                            </a>
                            <a
                                href="#"
                                onClick={toggleUniqueClicked}
                                className={`sidebar-grade-contentBtn${uniqueClicked ? ' clicked' : ''}`}
                            >
                                유니크
                            </a>
                            <a
                                href="#"
                                onClick={toggleLegendClicked}
                                className={`sidebar-grade-contentBtn${legendClicked ? ' clicked' : ''}`}
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
                                className={`sidebar-orderBy${priceHighClicked ? ' clicked' : ''}`}
                            >
                                가격 높은 순
                            </a>
                            <a
                                href="#"
                                onClick={togglePriceLowClicked}
                                className={`sidebar-orderBy${priceLowClicked ? ' clicked' : ''}`}
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
