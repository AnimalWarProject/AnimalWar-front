import React, { useState, useEffect } from 'react';
import { api } from '../../network/api';
import './ProfileBox.css';
import attackIcon from '../imgs/AttackPower.png';
import defenseIcon from '../imgs/DefensePower.png';
import lifeIcon from '../imgs/Life.png';
import rateIcon from '../imgs/Rate.png';
import dogIcon from '../imgs/Dog.png';
import catIcon from '../imgs/Cat.png';
import gliresIcon from '../imgs/Glires.png';
import fishIcon from '../imgs/Fish.png';
import birdIcon from '../imgs/Bird.png';
import defaultIcon from '../imgs/Default.png';
import landIcon from '../imgs/Land.png';
import seaIcon from '../imgs/Sea.png';
import mountainIcon from '../imgs/Mountain.png';

const ProfileBox = () => {
    const [profile, setProfile] = useState({});

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
                return { icon: dogIcon, text: '개' };
            case 'CAT':
                return { icon: catIcon, text: '고양이' };
            case 'GLIRES':
                return { icon: gliresIcon, text: '설치동물' };
            case 'FISH':
                return { icon: fishIcon, text: '어류' };
            case 'BIRD':
                return { icon: birdIcon, text: '조류' };
            default:
                return { icon: defaultIcon, text: '알 수 없음' };
        }
    };

    const getLandFormIcon = (landForm) => {
        switch (landForm) {
            case 'LAND':
                return { icon: landIcon, text: '육지' };
            case 'SEA':
                return { icon: seaIcon, text: '바다' };
            case 'MOUNTAIN':
                return { icon: mountainIcon, text: '산' };
            default:
                return { icon: defaultIcon, text: '알 수 없음' };
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    return (
        <div className="profile-box">
            <div className="profile-item">
                <img src={getSpeciesIcon(profile.species).icon} alt="species" />
                <span>{getSpeciesIcon(profile.species).text}</span>

                <img src={getLandFormIcon(profile.landForm).icon} alt="landForm" />
                <span>{getLandFormIcon(profile.landForm).text}</span>
            </div>
            <div className="stats-item">
                <img src={attackIcon} alt="attackPower" />
                <span>{profile.attackPower}</span>

                <img src={defenseIcon} alt="defensePower" />
                <span>{profile.defensePower}</span>

                <img src={lifeIcon} alt="Life" />
                <span>{profile.life}</span>
            </div>
            <div className="rate-item">
                <img src={rateIcon} alt="ratePerHour" />
                <span>시간당 자원생산량</span>
                <span>식량: {profile.food}</span>
                <span>철: {profile.iron}</span>
                <span>나무: {profile.wood}</span>
            </div>
        </div>
    );
};

export default ProfileBox;
