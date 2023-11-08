import { Routes, Route } from 'react-router-dom';
import GameTemplate from '../template/GameTemplate';
import BasicTemplate from '../template/BasicTemplate';
import RankingPage from '../pages/Ranking/RankingPage';
import MarketPage from '../pages/market/components/MarketPage';
import Match from '../pixi/Match/Match';
import DrawPage from '../pixi/draw/components/DrawPage';
import LoginPage from '../pages/login/LoginPage';
import SignupPage from '../pages/signup/SignupPage';
import Mix from '../pixi/Mix/Mix';
import DrawResult from '../pixi/draw/components/DrawResult';
import React from 'react';
import MatchProcess from '../pixi/Match/MatchProcess';
import MatchComplete from '../pixi/Match/MatchComplete';
import BorderTemplate from '../template/BorderTemplate';
import MyPage from '../pages/myPage/myPage';
import Battle from "../pixi/battle/components/Battle";
const MyRoutes = () => {
    return (
        <Routes>
            <Route element={<GameTemplate />}>
                <Route path="/match" element={<Match />} />
                <Route path="/draw" element={<DrawPage />} />
                <Route path="/draw/result" element={<DrawResult />} />
                <Route path="/mix" element={<Mix />}></Route>
                <Route path="/battle" element={<Battle />}></Route>
            </Route>
            <Route element={<BasicTemplate />}>
                <Route path="/market" element={<MarketPage />} />
                <Route path="/rank" element={<RankingPage />} />
                <Route path="/match" element={<Match />}></Route>
                <Route path="/match2" element={<MatchProcess />} />
                <Route path="/match3" element={<MatchComplete />} />
            </Route>
            <Route element={<BorderTemplate />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/my" element={<MyPage />} />
            </Route>
        </Routes>
    );
};
export default MyRoutes;