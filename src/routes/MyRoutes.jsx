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
import Mix from "../pixi/Mix/Mix";
import DrawResult from "../pixi/draw/components/DrawResult";
import React from "react";
import MatchProcess from '../pixi/Match/MatchProcess';
import MatchComplete from '../pixi/Match/MatchComplete';



const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<GameTemplate />}>
                <Route path="/test" element={<BattlePage />} />
                <Route path="/match" element={<Match />} />
                <Route path="/draw" element={<DrawPage />} />
                <Route path="/draw/loading" element={<DrawOneLoading />} />
                <Route path="/draw/result" element={<DrawResult />} />
            </Route>
            <Route element={<BasicTemplate />}>
                <Route path="/market" element={<MarketPage />} />
                <Route path="/rank" element={<RankingPage />} />
                <Route path="/test" element={<BattlePage />}></Route>
                <Route path="/match" element={<Match />}></Route>
                <Route path="/mix" element={<Mix />}></Route>
                <Route path="/match2" element={<MatchProcess />}></Route>
                <Route path="/match3" element={<MatchComplete />}></Route>

            </Route>
            <Route element={<BasicTemplate />}>
                <Route path="/market" element={<MarketPage />}></Route>
                <Route path="/rank" element={<RankingPage />}></Route>
            </Route>
        </Routes>
    );
};

export default MyRoutes;
