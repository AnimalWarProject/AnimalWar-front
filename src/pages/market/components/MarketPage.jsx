import React, {useState} from "react";
import "../css/MarketPage.css";
import SearchBox from "./SearchBox";
import SideBar from "./SideBar";
import Main from "./Main";
import MarketInven from "./MarketInven";
import Resister from "./Resister";

const MarketPage = () => {
    const [selectedAnimalType, setSelectedAnimalType] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [searchWord, setSearchWord] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedData, setSelectedData] = useState('');
    const [showMarketInven, setShowMarketInven] = useState(true); 

    const handleAnimalTypeSelect = (animalType) => {
        setSelectedAnimalType(animalType);
    };
    const handleSearchWord = (e) => {
        setSearchWord(e);
    };
    const handleSortSelect = (isSort) => {
        setSelectedSort(isSort);
    };
    const handleGradeSelect = (grade) => {
        setSelectedGrade(grade);
    };
    const handleEventInMarketInven = (dataForResister) => {
        if (dataForResister !== null){
            setSelectedData(dataForResister)
            setShowMarketInven(false);
        }else {
            alert("아이템을 선택해주세요.")
        }
    };
    const handleCancelRegistration = () => {
        // 취소 버튼 클릭 시 MarketInven 보이도록 상태 업데이트
        setShowMarketInven(true);
    };
    return <>
        <div className="marketPage-container">
            <div>
                <div>
                    <SearchBox onAnimalTypeSelect={handleAnimalTypeSelect} onSearchWord={handleSearchWord} />
                </div>
            </div>
            <div className="sidebar-main">
                <div>
                    <SideBar onSortSelect={handleSortSelect} onGradeSelect={handleGradeSelect} />
                </div>
                <div>
                    <Main
                        selectedAnimalType={selectedAnimalType}
                        selectedSort={selectedSort}
                        searchWord={searchWord}
                        selectedGrade={selectedGrade}
                    />
                </div>
            </div>
            <div>
                <div>
                    {showMarketInven ? (
                        <MarketInven onEventInMarketInven={handleEventInMarketInven} />
                    ) : (
                        <Resister onEventInMarketCancel={handleCancelRegistration} selectedData={selectedData} />
                    )}
                </div>
            </div>
        </div>
    </>;
};

export default MarketPage;