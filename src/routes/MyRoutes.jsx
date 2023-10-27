import { Routes, Route } from 'react-router-dom';
import Rank from '../pages/Ranking/components/Rank';
import BasicTemplate from '../template/BasicTemplate';
import BattlePage from '../pages/battle/Battlepage';

const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/rank" element={<Rank />}></Route>

            <Route element={<BasicTemplate />}>
                <Route path="/test" element={<BattlePage />}></Route>
            </Route>
        </Routes>
    );
};

export default MyRoutes;
