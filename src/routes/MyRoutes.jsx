import { Routes, Route } from 'react-router-dom';
import BattlePage from '../pages/battle/BattlePage';
import GameTemplate from '../template/GameTemplate';
import BasicTemplate from '../template/BasicTemplate';
import RankingPage from '../pages/Ranking/RankingPage';
import MarketPage from '../pages/market/components/MarketPage';

const MyRoutes = () => {
    return (
        <Routes>

            <Route element={<GameTemplate />}>
                <Route path="/test" element={<BattlePage />}></Route>
            </Route>
            <Route element={<BasicTemplate />}>
                <Route path="/market" element={<MarketPage />}></Route>
                <Route path="/rank" element={<RankingPage />}></Route>

            </Route>
        </Routes>
    );
};

export default MyRoutes;
