import React, {useState} from "react";
import "../css/MarketPage.css";
import SearchBox from "./SearchBox";
import SideBar from "./SideBar";
import Main from "./Main";
import MarketInven from "./MarketInven";

const MarketPage = () => {
    const [selectedAnimalType, setSelectedAnimalType] = useState('');
    const [selectedSort, setSelectedSort] = useState('');

    const handleAnimalTypeSelect = (animalType) => {
        setSelectedAnimalType(animalType);
    };

    const handleSortSelect = (isSort) => {
        setSelectedSort(isSort);
    };
    return <>
        <div className="marketPage-container">
            <div>
                <div>
                    <SearchBox onAnimalTypeSelect={handleAnimalTypeSelect} />
                </div>
            </div>
            <div className="sidebar-main">
                <div>
                    <SideBar onSortSelect={handleSortSelect} />
                </div>
                <div>
                    <Main selectedAnimalType={selectedAnimalType} selectedSort={selectedSort} />
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