import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';
import Header from '../common/components/Header';
import GameScreenTest from '../common/components/GameScreenTest';
import ResourceBox from '../common/components/ResourceBox';
import './BasicTemplate.css';
const BasicTemplate = () => {
    return (
        <>
            <Background className="background">
                <Outlet />
                <Header />
                <GameScreenTest />
                <ResourceBox />
            </Background>
        </>
    );
};

export default BasicTemplate;
