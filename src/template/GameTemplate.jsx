import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';
import Header from '../common/components/Header';
import GameScreenTest from '../common/components/GameScreenTest';
import ResourceBox from '../common/components/ResourceBox';
import Chatting from '../common/components/Chatting';
import './GameTemplate.css';
import ProfileBox from '../common/components/ProfileBox';

const GameTemplate = () => {
    return (
        <>
            <Background className="background">
                <Header />
                <div className="content-container">
                    <GameScreenTest />

                    <div className="box-container">
                        <ResourceBox />
                        <ProfileBox />
                        <Chatting />
                    </div>
                </div>
                <Outlet />
            </Background>
        </>
    );
};

export default GameTemplate;
