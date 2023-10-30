import React, { useState, useEffect } from 'react';
import { api } from '../../network/api';
import './ResourceBox.css';
import goldIcon from '../imgs/Gold.png';
import foodIcon from '../imgs/Food.png';
import woodIcon from '../imgs/Wood.png';
import ironIcon from '../imgs/Iron.png';

const ResourceBox = () => {
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

    useEffect(() => {
        getProfileData();
    }, []);

    return (
        <div className="resource-box">
            <div className="resource-line">
                <div className="resource-item">
                    <img src={goldIcon} alt="Gold" />
                    <span>{profile.gold}</span>
                </div>
                <div className="resource-item">
                    <img src={foodIcon} alt="Food" />
                    <span>{profile.food}</span>
                </div>
            </div>
            <div className="resource-line">
                <div className="resource-item">
                    <img src={woodIcon} alt="Wood" />
                    <span>{profile.wood}</span>
                </div>
                <div className="resource-item">
                    <img src={ironIcon} alt="Iron" />
                    <span>{profile.iron}</span>
                </div>
            </div>
        </div>
    );
};

export default ResourceBox;
