import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';
import './BorderTemplate.css';

const BorderTemplate = () => {
    return (
        <Background className="big-box">
            <div className="inside-box">
                <Outlet />
            </div>
        </Background>
    );
};

export default BorderTemplate;
