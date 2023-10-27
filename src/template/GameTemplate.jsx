import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';
import Header from '../common/components/Header';
import GameScreenTest from '../common/components/GameScreenTest';
import ResourceBox from '../common/components/ResourceBox';
import './GameTemplate.css';

const GameTemplate = () => {
    return (
        <>
            <Background className="background">
                <Outlet />
                <Header />
                <div className="content-container">
                    <GameScreenTest />
                    <ResourceBox />

                </div>
            </Background>
        </>
    );
};

export default GameTemplate;
