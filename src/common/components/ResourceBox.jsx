import React, { useState, useEffect } from 'react';
import { api } from '../../network/api';
import './ResourceBox.css';
import GoldImage from '../imgs/Gold.webp';
import FoodImage from '../imgs/Food.webp';
import WoodImage from '../imgs/Wood.webp';
import IronImage from '../imgs/Iron.webp';
const ResourceBox = () => {
    const [profile, setProfile] = useState({});
    const icons = {
        Gold: GoldImage,
        Food: FoodImage,
        Wood: WoodImage,
        Iron: IronImage,
    };
    const getProfileData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: userProfile } = await api('/api/v1/user', 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
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
                    <img src={icons.Gold} alt="Gold" />
                    <span>{profile.gold}</span>
                </div>
                <div className="resource-item">
                    <img src={icons.Food} alt="Food" />
                    <span>{profile.food}</span>
                </div>
            </div>
            <div className="resource-line">
                <div className="resource-item">
                    <img src={icons.Wood} alt="Wood" />
                    <span>{profile.wood}</span>
                </div>
                <div className="resource-item">
                    <img src={icons.Iron} alt="Iron" />
                    <span>{profile.iron}</span>
                </div>
            </div>
        </div>
    );
};
export default ResourceBox;
