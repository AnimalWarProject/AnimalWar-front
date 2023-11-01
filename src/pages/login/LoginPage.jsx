import React, { useState, useEffect } from 'react';
import { apiNoToken } from '../../network/api';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import './Login.css';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImageFromFirebase = async () => {
            const storage = getStorage();
            const imageRef = ref(storage, 'AnimalCrowd.png');

            try {
                const url = await getDownloadURL(imageRef);
                setImgUrl(url);
            } catch (error) {
                console.error('Failed to fetch image URL:', error);
            }
        };

        fetchImageFromFirebase();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await apiNoToken('api/v1/auth/login', 'POST', {
                id,
                password,
            });
            if (response.data && response.data.accessToken && response.data.refreshToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                navigate('/');
            } else {
                alert('로그인 실패');
            }
        } catch (error) {
            alert('서버 오류 발생');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-container">
                <h2>로그인</h2>
                <input type="id" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>로그인</button>
            </div>
            {imgUrl && <img src={imgUrl} alt="Animal Crowd" className="login-image" />}
        </div>
    );
};

export default LoginPage;
