import { Route, Routes } from 'react-router-dom';
import GameTemplate from '../template/GameTemplate';
import BasicTemplate from '../template/BasicTemplate';
import RankingPage from '../pages/Ranking/RankingPage';
import MarketPage from '../pages/market/components/MarketPage';
import Match from '../pixi/Match/Match';
import DrawPage from '../pixi/draw/components/DrawPage';
import LoginPage from '../pages/login/LoginPage';
import SignupPage from '../pages/signup/SignupPage';
import DrawResult from '../pixi/draw/components/DrawResult';
import React from 'react';
import MatchProcess from '../pixi/Match/MatchProcess';
import MatchComplete from '../pixi/Match/MatchComplete';
import BorderTemplate from '../template/BorderTemplate';
import MixStart from '../pixi/Mix/MixStart';
import MixFail from '../pixi/Mix/MixFail';
import MixSuccess from '../pixi/Mix/MixSuccess';
import MyPage from '../pages/myPage/myPage';
import UpGradePage from '../pixi/upGrade/components/UpGradePage';
import UpGradeLoading from '../pixi/upGrade/components/UpGradeLoading';
import UpGradeResult from '../pixi/upGrade/components/UpGradeResult';
import UserInfo from '../pages/userInfo/UserInfo';
import TerrainPage from '../pixi/terrain/TerrainPage';
import Exchange from '../pixi/Exchange/Exchange';
import AttackerSkill from "../pixi/battle/components/AttackerSkill";
import DefenderSkill from "../pixi/battle/components/DefenderSkill";
import Battle from "../pixi/battle/components/Battle";
import GameResult from "../pixi/battle/components/GameResult";
import Place from '../pixi/place/Place';
import Board from '../pages/board/components/Board';
import BoardDetail from '../pages/board/components/BoardDetail';
import Mix from "../pixi/Mix/Mix";
import DrawLoading from "../pixi/draw/components/DrawLoading";

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
                <Route path="/mixTest" element={<Mix />}></Route>
                <Route path="/terrain" element={<TerrainPage />} />
                <Route Path="/exchange" element={<Exchange />} />
                <Route path="/match" element={<Match />} />
                <Route path="/match2" element={<MatchProcess />} />
                <Route path="/match3" element={<MatchComplete />} />
                <Route path="/battle" element={<AttackerSkill />}></Route>
                <Route path="/battle1" element={<DefenderSkill />}></Route>
                <Route path="/battle2" element={<Battle />}></Route>
                <Route path="/battle3" element={<GameResult />}></Route>
                <Route path="/exchange" element={<Exchange />}></Route>
                <Route path="/place" element={<Place />}></Route>
            </Route>
            <Route element={<BasicTemplate />}>
                <Route path="/market" element={<MarketPage />} />
                <Route path="/rank" element={<RankingPage />} />

                <Route path="/my" element={<MyPage />} />
                <Route path="/userInfo" element={<UserInfo />} />
                <Route path="/board" element={<Board />} />
                <Route path="/BoardDetail" element={<BoardDetail />} />
            </Route>
            <Route element={<BorderTemplate />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>
        </Routes>
    );
};
export default MyRoutes;
