import React, { useState, useEffect } from 'react';
import { api } from '../../network/api';

const MyPage = () => {
    const [userProfile, setUserProfile] = useState({
        id: '',
        password: '',
        nickName: '',
        profileImage: '',
    });

    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        try {
            const { data: tokenInfo } = await api('api/v1/auth/me', 'GET');
            const userId = tokenInfo.id;

            const { data: userData } = await api(`api/v1/user/findByID/${userId}`, 'GET');
            setUserProfile(userData);
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const updateProfile = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await api('api/v1/user/update', 'POST', userProfile, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.data === '유저 정보 변경 완료') {
                alert('Successfully updated user info!');
                getProfileData();
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update user info. Please try again.');
        }
    };

    return (
        <div className="myPage">
            <h2>내 정보</h2>
            <div className="updateForm">
                <input name="id" value={userProfile.id} placeholder="Update ID" onChange={handleInputChange} />
                <input name="password" type="password" placeholder="Update Password" onChange={handleInputChange} />
                <input
                    name="nickName"
                    value={userProfile.nickName}
                    placeholder="Update NickName"
                    onChange={handleInputChange}
                />
                <input
                    name="profileImage"
                    value={userProfile.profileImage}
                    placeholder="Update Profile Image URL"
                    onChange={handleInputChange}
                />
                <button onClick={updateProfile}>Update</button>
            </div>
        </div>
    );
};

export default MyPage;
