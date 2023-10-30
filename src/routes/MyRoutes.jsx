import { Routes, Route } from 'react-router-dom';
import Rank from '../pages/Ranking/components/Rank';
import BattlePage from '../pages/battle/BattlePage';
import GameTemplate from '../template/GameTemplate';
import BasicTemplate from '../template/BasicTemplate';
import MarketPage from "../pages/market/components/MarketPage";
import DrawPage from "../pages/draw/components/DrawPage";


const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/rank" element={<Rank />}></Route>
s
            <Route element={<GameTemplate />}>
                <Route path="/test" element={<BattlePage />}></Route>
            </Route>
            <Route element={<BasicTemplate />}>
                 <Route path="/market" element={<MarketPage />}></Route>
                 <Route path="/draw" element={<DrawPage />}></Route>
            </Route>
        </Routes>
    );
};

export default MyRoutes;
