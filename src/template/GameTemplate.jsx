import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';
import Header from '../common/components/Header';
import ResourceBox from '../common/components/ResourceBox';
import './GameTemplate.css';
import ProfileBox from '../common/components/ProfileBox';
import Chatting from "../common/components/Chatting";


const GameTemplate = () => {
    return (
        <>
            <Background className="background">
                <Header />
                <div className="content-container">
                    <div className="outlet-container">
                        <Outlet />
                    </div>
                    <div className="box-container">
                        <ResourceBox />
                        <ProfileBox />
                        <Chatting />
                    </div>
                </div>
            </Background>
        </>
    );
};

export default GameTemplate;
