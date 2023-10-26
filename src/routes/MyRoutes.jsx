import { Routes, Route } from 'react-router-dom';
import Rank from '../pages/Ranking/components/Rank';
import Header from '../common/components/Header';

const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/rank" element={<Rank />}></Route>
            <Route path="/test" element={<Header />}></Route>
            {/* <Route path="/redirect" element={<KakaoLoginRedirect />}></Route>
              <Route path="/logout" element={<Logout />}></Route> */}
        </Routes>
    );
};

export default MyRoutes;
