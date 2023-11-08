import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiNoToken } from '../../network/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

import AnimalCrowdImage from './imgs/AnimalCrowd.webp';
import LogoImage from './imgs/Logo.webp';
import SmallEggImage from './imgs/SmallEgg.webp';
import LockImage from './imgs/Lock.webp';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await apiNoToken('/api/v1/auth/login', 'POST', {
                id,
                password,
            });
            if (response.data && response.data.accessToken && response.data.refreshToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                navigate('/home');
            } else {
                toast.error('아이디 또는 비밀번호를 다시 확인해주세요');
            }
        } catch (error) {
            toast.error('서버 오류 발생');
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <img src={LogoImage} alt="Logo" className="login-logo" />
                <div className="input-with-icon">
                    <img src={SmallEggImage} alt="ID Icon" className="input-icon" />
                    <input
                        type="text" // 변경된 부분: 'id' 타입이 존재하지 않으므로 'text'로 변경
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="login-input"
                    />
                </div>
                <div className="input-with-icon">
                    <img src={LockImage} alt="Password Icon" className="input-icon" />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                </div>
                <div className="button-container">
                    <button onClick={handleLogin}>로그인</button>
                    <button onClick={handleSignUp}>회원가입</button>
                </div>
            </div>
            <div className="login-image" style={{ backgroundImage: `url(${AnimalCrowdImage})` }} />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default LoginPage;
