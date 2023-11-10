import React, {useState} from "react";
import "../css/MarketPage.css";
import SearchBox from "./SearchBox";
import SideBar from "./SideBar";
import Main from "./Main";
import MarketInven from "./MarketInven";

const MarketPage = () => {
    const [selectedAnimalType, setSelectedAnimalType] = useState('');

    const handleAnimalTypeSelect = (animalType) => {
        setSelectedAnimalType(animalType);
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
                    <SideBar />
                </div>
                <div>
                    <Main selectedAnimalType={selectedAnimalType} />
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