import React, { useState, useEffect } from 'react';
import { api } from '../../network/api';
import './ProfileBox.css';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ProfileBox = () => {
    const [profile, setProfile] = useState({});
    const [icons, setIcons] = useState({});

    const fetchImageFromFirebase = async (imageName) => {
        const storage = getStorage();
        const imageRef = ref(storage, imageName);

        try {
            return await getDownloadURL(imageRef);
        } catch (error) {
            console.error(`Failed to fetch ${imageName} URL:`, error);
            return null;
        }
    };

    const loadIcons = async () => {
        const imageNames = [
            'AttackPower.png',
            'DefensePower.png',
            'Life.png',
            'Rate.png',
            'Dog.png',
            'Cat.png',
            'Glires.png',
            'Fish.png',
            'Bird.png',
            'Default.png',
            'Land.png',
            'Sea.png',
            'Mountain.png',
        ];

        const newIcons = {};
        for (let name of imageNames) {
            newIcons[name.split('.')[0]] = await fetchImageFromFirebase(name);
        }

        setIcons(newIcons);
    };

    const getProfileData = async () => {
        try {
            const { data: tokenInfo } = await api(`api/v1/auth/me`, 'GET');
            const userId = tokenInfo.userId;
            const { data: userProfile } = await api(`api/v1/user/findByID/${userId}`, 'GET');
            setProfile(userProfile);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const getSpeciesIcon = (species) => {
        switch (species) {
            case 'DOG':
                return { icon: 'Dog', text: '개' };
            case 'CAT':
                return { icon: 'Cat', text: '고양이' };
            case 'GLIRES':
                return { icon: 'Glires', text: '설치동물' };
            case 'FISH':
                return { icon: 'Fish', text: '어류' };
            case 'BIRD':
                return { icon: 'Bird', text: '조류' };
            default:
                return { icon: 'Default', text: '알 수 없음' };
        }
    };

    const getLandFormIcon = (landForm) => {
        switch (landForm) {
            case 'LAND':
                return { icon: 'Land', text: '육지' };
            case 'SEA':
                return { icon: 'Sea', text: '바다' };
            case 'MOUNTAIN':
                return { icon: 'Mountain', text: '산' };
            default:
                return { icon: 'Default', text: '알 수 없음' };
        }
    };

    useEffect(() => {
        getProfileData();
        loadIcons();
    }, []);

    return (
        <div className="profile-box">
            <div className="profile-item">
                <img src={icons[getSpeciesIcon(profile.species).icon]} alt="species" />
                <span>{getSpeciesIcon(profile.species).text}</span>

                <img src={icons[getLandFormIcon(profile.landForm).icon]} alt="landForm" />
                <span>{getLandFormIcon(profile.landForm).text}</span>
            </div>
            <div className="stats-item">
                <img src={icons.AttackPower} alt="attackPower" />
                <span>{profile.attackPower}</span>

                <img src={icons.DefensePower} alt="defensePower" />
                <span>{profile.defensePower}</span>

                <img src={icons.Life} alt="Life" />
                <span>{profile.life}</span>
            </div>
            <div className="rate-item">
                <img src={icons.Rate} alt="ratePerHour" />
                <span>시간당 자원생산량</span>
                <span>식량: {profile.food}</span>
                <span>철: {profile.iron}</span>
                <span>나무: {profile.wood}</span>
            </div>
        </div>
    );
};

export default ProfileBox;
