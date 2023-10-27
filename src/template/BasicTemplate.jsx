import { Outlet } from 'react-router-dom';
import Background from '../common/components/Background';
import Header from '../common/components/Header';

const BasicTemplate = () => {
    return (
        <>
            <Background className="background">
                <Outlet />
                <Header />
            </Background>
        </>
    );
};

export default BasicTemplate;
