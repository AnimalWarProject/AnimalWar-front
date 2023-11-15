import React, {useState} from "react";
import "../css/MarketPage.css";
import SearchBox from "./SearchBox";
import SideBar from "./SideBar";
import Main from "./Main";
import MarketInven from "./MarketInven";

const MarketPage = () => {
    const [selectedAnimalType, setSelectedAnimalType] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [searchWord, setSearchWord] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');

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
                    <MarketInven />
                </div>
            </div>
        </div>
    </>;
};

export default MarketPage;