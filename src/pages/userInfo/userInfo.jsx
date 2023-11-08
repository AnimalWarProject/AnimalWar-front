import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './UserInfo.css';

function UserInfo() {
    // 초기 user 상태를 세션에서 가져오거나 없으면 null로 설정합니다.
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const location = useLocation();

    useEffect(() => {
        // location.state.user가 있으면 사용하고, 없으면 세션에서 가져옵니다.
        const userFromLocation = location.state?.user;
        const userFromSearch = userFromLocation || user;

        if (userFromSearch) {
            setUser(userFromSearch);
            sessionStorage.setItem('userInfo', JSON.stringify(userFromSearch));
        }
    }, [location.state]); // location.state에 대한 의존성만 지정합니다.

    if (user === undefined) {
        return <div className="user-info">해당하는 유저가 없습니다.</div>;
    }

    if (!user) {
        return <div>검색 중입니다...</div>;
    }

    return (
        <div className="user-info-part">
            <div className="profile-part">
                <div className="profile-image-part">
                    <img src={user.profileImage} alt={`${user.nickName}'s profile`} className="profile-image" />
                </div>
                <div className="user-details-part">
                    <div className="nickname-part">
                        <h2>{user.nickName}</h2>
                    </div>
                    <div className="other-info-part">
                        <div className="other-item">
                            <span className="other-item-label">대표 종족:</span>
                            <span className="other-item-value">{user.species?.name || 'N/A'}</span>
                        </div>
                        <div className="other-item">
                            <span className="other-item-label">대표 지형:</span>
                            <span className="other-item-value">{user.landForm?.name || 'N/A'}</span>
                        </div>
                        <div className="other-item">
                            <span className="other-item-label">배틀 포인트:</span>
                            <span className="other-item-value">{user.battlePoint}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="resources-part">
                <h3>자원 보유량</h3>
                <div className="resources-row">
                    <div className="user-resource-item">
                        <span className="user-resource-item-label">식량:</span>
                        <span className="user-resource-item-value">{user.food}</span>
                    </div>
                    <div className="user-resource-item">
                        <span className="user-resource-item-label">철제:</span>
                        <span className="user-resource-item-value">{user.iron}</span>
                    </div>
                </div>
                <div className="resources-row">
                    <div className="user-resource-item">
                        <span className="user-resource-item-label">나무:</span>
                        <span className="user-resource-item-value">{user.wood}</span>
                    </div>
                    <div className="user-resource-item">
                        <span className="user-resource-item-label">골드:</span>
                        <span className="user-resource-item-value">{user.gold}</span>
                    </div>
                </div>
            </div>
            <div className="other-info-part">
                <h3>스탯</h3>
                <div className="other-item">
                    <span className="other-item-label">공격력:</span>
                    <span className="other-item-value">{user.attackPower}</span>
                </div>
                <div className="other-item">
                    <span className="other-item-label">방어력:</span>
                    <span className="other-item-value">{user.defensePower}</span>
                </div>
                <div className="other-item">
                    <span className="other-item-label">생명력:</span>
                    <span className="other-item-value">{user.life}</span>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
