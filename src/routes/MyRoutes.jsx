import { Route, Routes } from 'react-router';
// import Template from '../templates/Template';
// import MainPage from '../Main';
// import SignUp from '../pages/signup';
// import Login from '../pages/login';
import Background from '../common/components/Background';

const MyRoutes = () => {
    return (
        <Routes>
            {/* <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route> */}

            {/* 테스트용루트 */}
            <Route path="/test" element={<Background />}></Route>
            {/* 
            <Route element={<Template />}>
                <Route path="/" element={<MainPage />} />
            </Route> */}
        </Routes>
    );
};

export default MyRoutes;
