import { Routes, Route } from 'react-router-dom';
import BattlePage from '../pages/battle/BattlePage';
import GameTemplate from '../template/GameTemplate';
import BasicTemplate from '../template/BasicTemplate';
import RankingPage from '../pages/Ranking/RankingPage';
import MarketPage from '../pages/market/components/MarketPage';
import Match from '../pixi/Match/Match';
import DrawPage from '../pixi/draw/components/DrawPage';
import LoginPage from '../pages/login/LoginPage';
import SignupPage from '../pages/signup/SignupPage';
import DrawResult from "../pixi/draw/components/DrawResult";

const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>

            <Route element={<GameTemplate />}>
                <Route path="/test" element={<BattlePage />}></Route>
                <Route path="/match" element={<Match />}></Route>
                <Route path="/draw" element={<DrawPage />}></Route>
                <Route path="/drawResult" element={<DrawResult />}></Route>
            </Route>
            <Route element={<BasicTemplate />}>
                <Route path="/market" element={<MarketPage />}></Route>
                <Route path="/rank" element={<RankingPage />}></Route>
            </Route>
        </Routes>
    );
};

export default MyRoutes;
