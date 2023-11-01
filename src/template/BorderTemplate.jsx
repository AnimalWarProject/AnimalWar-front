import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';

const BorderTemplate = () => {
    return (
        <>
            <Background className="background">
                <Outlet />
            </Background>
        </>
    );
};

export default BorderTemplate;
