
import {Route, Routes} from 'react-router-dom';
import BattlePage from '../pages/battle/BattlePage';
import GameTemplate from '../template/GameTemplate';
import BasicTemplate from '../template/BasicTemplate';
import RankingPage from '../pages/Ranking/RankingPage';
import MarketPage from '../pages/market/components/MarketPage';
import Match from '../pixi/Match/Match';
import DrawPage from '../pixi/draw/components/DrawPage';
import LoginPage from '../pages/login/LoginPage';
import SignupPage from '../pages/signup/SignupPage';
import Mix from '../pixi/Mix/Mix';
import React from 'react';
import MatchProcess from '../pixi/Match/MatchProcess';
import MatchComplete from '../pixi/Match/MatchComplete';
import BorderTemplate from '../template/BorderTemplate';
import MixStart from "../pixi/Mix/MixStart";
import DrawLoading from "../pixi/draw/components/DrawLoading";
import DrawResult from "../pixi/draw/components/DrawResult";
import UpGradePage from "../pixi/upGrade/components/UpGradePage";
import MixFail from "../pixi/Mix/MixFail";
import MixSuccess from "../pixi/Mix/MixSuccess";
import MyPage from '../pages/myPage/myPage';
import DrawLoading from '../pixi/draw/components/DrawLoading';
import DrawResult from '../pixi/draw/components/DrawResult';
import UpGradePage from '../pixi/upGrade/components/UpGradePage';
import UpGradeLoading from '../pixi/upGrade/components/UpGradeLoading';
import UpGradeResult from '../pixi/upGrade/components/UpGradeResult';
import UserInfo from '../pages/userInfo/UserInfo';
import TerrainPage from '../pixi/terrain/TerrainPage';


const MyRoutes = () => {
    return (
        <Routes>
            <Route element={<GameTemplate />}>
                <Route path="/match" element={<Match />} />
                <Route path="/draw" element={<DrawPage />} />
                <Route path="/draw/loading" element={<DrawLoading />} />
                <Route path="/draw/result" element={<DrawResult />} />
                <Route path="/mix" element={<Mix />}></Route>
                <Route path="/mix2" element={<MixStart />}></Route>
                <Route path="/mix3" element={<MixFail />}></Route>
                <Route path="/mix4" element={<MixSuccess />}></Route>
                <Route path="/upgrade" element={<UpGradePage />} />
                <Route path="/upgrade/loading" element={<UpGradeLoading />} />
                <Route path="/upgrade/result" element={<UpGradeResult />} />
                <Route path="/mix" element={<Mix />}></Route>
                <Route path="/terrain" element={<TerrainPage />} />
            </Route>
            <Route element={<BasicTemplate />}>
                <Route path="/market" element={<MarketPage />} />
                <Route path="/rank" element={<RankingPage />} />
                <Route path="/match" element={<Match />}></Route>
                <Route path="/match2" element={<MatchProcess />} />
                <Route path="/match3" element={<MatchComplete />} />
                <Route path="/my" element={<MyPage />} />
                <Route path="/userInfo" element={<UserInfo />} />
            </Route>
            <Route element={<BorderTemplate />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>
        </Routes>
    );
};

export default MyRoutes;
