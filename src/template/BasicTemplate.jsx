import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';
import Header from '../common/components/Header';
import MarketPage from "../pages/market/components/MarketPage";

const BasicTemplate = () => {
    return (
        <>
            <Background className="background">
                <Header />
                <Outlet />
            </Background>
        </>
    );
};

export default BasicTemplate;
