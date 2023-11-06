import React, { useState, useEffect } from 'react';
import './myPage.css';
import { api } from '../../network/api';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import uploadImageToFirebase from '../../network/FirebaseUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPage = () => {
    const [userProfile, setUserProfile] = useState({
        id: '',
        password: '',
        nickName: '',
        profileImage: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: userData } = await api('/api/v1/user', 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const maxSize = 3 * 1024 * 1024; // 3MB
        if (file && file.size > maxSize) {
            toast.error('The file size should not exceed 3MB.');
            return;
        }
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl('');
        }
    };

    const updateProfile = async () => {
        if (selectedFile) {
            const storage = getStorage();
            if (userProfile.profileImage) {
                const oldImageRef = ref(storage, userProfile.profileImage);
                await deleteObject(oldImageRef).catch((error) => {
                    console.error('Failed to delete the old image:', error);
                    toast.error('기존 이미지 삭제에 실패했습니다.');
                });
            }

            await uploadImageToFirebase(selectedFile)
                .then((newUrl) => {
                    setUserProfile((prevProfile) => ({
                        ...prevProfile,
                        profileImage: newUrl,
                    }));
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    toast.error('이미지 파일 업로드에 실패했습니다.');
                });
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const updatedProfile = {
                ...userProfile,
                profileImage: selectedFile ? userProfile.profileImage : userProfile.profileImage,
            };

            const response = await api('api/v1/user/update', 'POST', updatedProfile, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.data === '유저 정보 변경 완료') {
                toast.success('유저 정보 변경 완료');
                getProfileData();
                setSelectedFile(null);
            } else {
                toast.error('유저 정보 변경 실패');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('유저 정보 변경에 실패했습니다.');
        }
    };

    return (
        <div className="myPage">
            <h2>내 정보</h2>
            <div className="updateForm">
                <input
                    className="input-common input-id"
                    name="id"
                    value={userProfile.id}
                    placeholder="ID를 입력해주세요"
                    onChange={handleInputChange}
                />
                <input
                    className="input-common input-password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    onChange={handleInputChange}
                />
                <input
                    className="input-common input-nickname"
                    name="nickName"
                    value={userProfile.nickName}
                    placeholder="닉네임을 입력해주세요"
                    onChange={handleInputChange}
                />
                {imagePreviewUrl && (
                    <img src={imagePreviewUrl} alt="Profile Preview" className="profile-image-preview" />
                )}
                {selectedFile && <span className="file-name">{selectedFile.name}</span>}
                <button
                    className="file-input-button"
                    onClick={() => document.getElementById('profile-image-upload').click()}
                >
                    새로운 프로필 이미지 가져오기
                </button>
                <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <button className="info-update-button" onClick={updateProfile}>
                    회원정보 변경하기
                </button>
            </div>
            <ToastContainer position="top-center" autoClose={5000} />
        </div>
    );
};

export default MyPage;
