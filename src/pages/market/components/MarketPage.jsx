import React from "react";
import "../css/MarketPage.css";
import SearchBox from "./SearchBox";
import SideBar from "./SideBar";
import Main from "./Main";
import MarketInven from "./MarketInven";

const MarketPage = () => {
    return <>
        <div className="marketPage-container">
            <div>
                <div>
                    <SearchBox />
                </div>
            </div>
            <div className="sidebar-main">
                <div>
                    <SideBar />
                </div>
                <div>
                    <Main />
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