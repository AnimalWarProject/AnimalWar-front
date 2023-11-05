import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { apiNoToken } from '../../network/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [idIconUrl, setIdIconUrl] = useState('');
    const [passwordIconUrl, setPasswordIconUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storage = getStorage();
        const fetchImage = async (imagePath, setImage) => {
            const imageRef = ref(storage, imagePath);

            try {
                const url = await getDownloadURL(imageRef);
                setImage(url);
            } catch (error) {
                console.error(`Failed to fetch ${imagePath} URL:`, error);
            }
        };

        fetchImage('AnimalCrowd.png', setImgUrl);
        fetchImage('Logo.png', setLogoUrl);
        fetchImage('SmallEgg.png', setIdIconUrl);
        fetchImage('Lock.png', setPasswordIconUrl);
    }, []);
    //didmount, willmount로 수정 고려

    const handleLogin = async () => {
        try {
            const response = await apiNoToken('api/v1/auth/login', 'POST', {
                id,
                password,
            });
            if (response.data && response.data.accessToken && response.data.refreshToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                //리프레시 데이터로 보내는 것 추가해야함
                navigate('/');
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
                {logoUrl && <img src={logoUrl} alt="Logo" className="login-logo" />}
                <div className="input-with-icon">
                    {idIconUrl && <img src={idIconUrl} alt="ID Icon" className="input-icon" />}
                    <input
                        type="id"
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="login-input"
                    />
                </div>
                <div className="input-with-icon">
                    {passwordIconUrl && <img src={passwordIconUrl} alt="Password Icon" className="input-icon" />}
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
            {imgUrl && <div className="login-image" style={{ backgroundImage: `url(${imgUrl})` }} />}
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
