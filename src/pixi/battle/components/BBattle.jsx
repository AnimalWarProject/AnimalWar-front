import React, { useEffect, useState } from 'react';
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';
import { api } from '../../../network/api';
import data from "bootstrap/js/src/dom/data";

const Battle = () => {
    const [attacker, setAttacker] = useState({
        nickName: '공격자',
        currentHealth: 10000,
        maxHealth: 10000,
        attackPower: null,
        defensePower: null,
        profileImage: Swap,
        color: '#FC5740',
    });

    const [defender, setDefender] = useState({
        nickName: '수비자',
        currentHealth: 10000,
        maxHealth: 10000,
        attackPower: null,
        defensePower: null,
        profileImage: Swap,
        color: '#5B7FFF',
    });

    const [battleLog, setBattleLog] = useState([]);
    const [isAnimatingLog, setIsAnimatingLog] = useState(false);

    const sendBattleDataToServer = async () => {
        try {
            const requestBody = {
                attacker: {
                    id: data.state.state.attacker.id,
                    nickName: data.state.state.attacker.nickName,
                    species: data.state.state.attacker.species,
                    profileImage: data.state.state.attacker.profileImage,
                    life: data.state.state.attacker.life,
                    maxLife: data.state.state.attacker.maxLife,
                    attackPower: data.state.state.attacker.attackPower,
                    defensePower: data.state.state.attacker.defensePower,
                    stringAttackTypeSkill: data.state.state.attacker.attackerAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.attacker.attackerDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.attacker.attackerUtilityTypeSkill,
                    food: data.state.state.attacker.food,
                    gold : data.state.state.attacker.gold,
                    iron: data.state.state.attacker.iron,
                    wood: data.state.state.attacker.wood
                },
                defender: {
                    id: data.state.state.depender.id,
                    nickName: data.state.state.depender.nickName,
                    species: data.state.state.depender.species,
                    profileImage: data.state.state.depender.profileImage,
                    life: data.state.state.depender.life,
                    maxLife: data.state.state.depender.maxLife,
                    attackPower: data.state.state.depender.attackPower,
                    defensePower: data.state.state.depender.defensePower,
                    stringAttackTypeSkill: data.state.state.depender.defenderAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.depender.defenderDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.depender.defenderUtilityTypeSkill,
                    food: data.state.state.depender.food,
                    gold : data.state.state.depender.gold,
                    iron: data.state.state.depender.iron,
                    wood: data.state.state.depender.wood
                },
            };
            const stateToken = localStorage.getItem('stateToken');
            const response = await api('/api/v1/battle', 'POST', requestBody, {
                headers: {
                    Authorization: `Bearer ${stateToken}`,
                },
            });
            console.log(response);
            const logEntries = response.data;
            if (logEntries) {
                setBattleLog(logEntries);
                setIsAnimatingLog(true);
            }
        } catch (error) {
            console.error('Error sending battle data:', error);
        }
    };

    useEffect(() => {
        sendBattleDataToServer();
    }, []);

    useEffect(() => {
        const logAnimationTimeouts = [];
        if (isAnimatingLog) {
            battleLog.forEach((logEntry, index) => {
                const timeout = setTimeout(() => {
                    setBattleLog((prevLogs) => [...prevLogs, logEntry]);
                }, 1000 * index);
                logAnimationTimeouts.push(timeout);
            });

            // Clear animation state after all logs are animated
            const clearAnimationTimeout = setTimeout(() => {
                setIsAnimatingLog(false);
            }, 1000 * battleLog.length);

            return () => {
                logAnimationTimeouts.forEach((timeout) => clearTimeout(timeout));
                clearTimeout(clearAnimationTimeout);
            };
        }
    }, [isAnimatingLog, battleLog]);

    return (
        <div className="outlet-container">
            <div style={{ width: '960px', height: '640px', backgroundImage: `url(${backgroundImage})`, position: 'relative' }}>
                {/* Battle User State Boxes */}
                <div
                    style={{
                        position: 'absolute',
                        top: '70px',
                        left: '70px',
                        width: '365px',
                        height: '154px',
                        backgroundColor: `rgba(255, 255, 255, 0.4)`,
                        borderRadius: '10px',
                    }}
                >
                    {/* Attacker State */}
                    <div>
                        <img src={attacker.profileImage} alt="profile" style={{ width: '70px', height: '70px' }} />
                        <div>{attacker.nickName}</div>
                        <div>{`공격력: ${attacker.attackPower} | 방어력: ${attacker.defensePower}`}</div>
                        <div>{`HP: [${attacker.currentHealth} / ${attacker.maxHealth}]`}</div>
                    </div>
                </div>
                {/* Defender State */}
                <div
                    style={{
                        position: 'absolute',
                        top: '70px',
                        left: '515px',
                        width: '365px',
                        height: '154px',
                        backgroundColor: `rgba(255, 255, 255, 0.4)`,
                        borderRadius: '10px',
                    }}
                >
                    <div>
                        <img src={defender.profileImage} alt="profile" style={{ width: '70px', height: '70px' }} />
                        <div>{defender.nickName}</div>
                        <div>{`공격력: ${defender.attackPower} | 방어력: ${defender.defensePower}`}</div>
                        <div>{`HP: [${defender.currentHealth} / ${defender.maxHealth}]`}</div>
                    </div>
                </div>

                {/* Battle Log Box */}
                <div
                    style={{
                        position: 'absolute',
                        top: '250px',
                        left: '70px',
                        width: '810px',
                        height: '320px',
                        backgroundColor: `rgba(255, 255, 255, 0.4)`,
                        borderRadius: '10px',
                        overflowY: 'auto',
                    }}
                >
                    {battleLog.map((logEntry, index) => (
                        <div key={index} style={{ fontSize: '15px', color: '#0f1828', fontWeight: 'bolder', fontFamily: 'Arial', marginBottom: '20px' }}>
                            {logEntry}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Battle;










































import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useLocation } from 'react-router';

// 이미지
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';
import {api} from "../../../network/api";

const Battle = () => {
    const pixiContainer = useRef(null);

    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const location = useLocation();
    const data = location.state;
    console.log("======================")
    console.log(data);

    const sendBattleDataToServer = async () => {
        try {
            const requestBody = {
                attacker: {
                    id: data.state.state.attacker.id,
                    nickName: data.state.state.attacker.nickName,
                    species: data.state.state.attacker.species,
                    profileImage: data.state.state.attacker.profileImage,
                    life: data.state.state.attacker.life,
                    maxLife: data.state.state.attacker.maxLife,
                    attackPower: data.state.state.attacker.attackPower,
                    defensePower: data.state.state.attacker.defensePower,
                    stringAttackTypeSkill: data.state.state.attacker.attackerAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.attacker.attackerDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.attacker.attackerUtilityTypeSkill,
                    food: data.state.state.attacker.food,
                    gold : data.state.state.attacker.gold,
                    iron: data.state.state.attacker.iron,
                    wood: data.state.state.attacker.wood
                },
                defender: {
                    id: data.state.state.depender.id,
                    nickName: data.state.state.depender.nickName,
                    species: data.state.state.depender.species,
                    profileImage: data.state.state.depender.profileImage,
                    life: data.state.state.depender.life,
                    maxLife: data.state.state.depender.maxLife,
                    attackPower: data.state.state.depender.attackPower,
                    defensePower: data.state.state.depender.defensePower,
                    stringAttackTypeSkill: data.state.state.depender.defenderAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.depender.defenderDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.depender.defenderUtilityTypeSkill,
                    food: data.state.state.depender.food,
                    gold : data.state.state.depender.gold,
                    iron: data.state.state.depender.iron,
                    wood: data.state.state.depender.wood
                },
            };
            const stateToken = localStorage.getItem('stateToken');
            const response = await api('/api/v1/battle', 'POST', requestBody, {
                headers: {
                    Authorization: `Bearer ${stateToken}`,
                },
            });
            console.log(response)
            const logEntries = response.data;
            if (logEntries){
                setBattleLog(logEntries);
            }
        } catch (error) {
            console.error('Error sending battle data:', error);
        }
    };

    useEffect(() => {
        // 기본 배경크기 설정
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);

        // 화면 뒷 배경
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // 배틀 유저 상태 박스 담는 컨테이너
        const stateContainer = new PIXI.Container();
        app.stage.addChild(stateContainer);

        // 배틀 로그 담는 컨테이너
        const logContainer = new PIXI.Container();
        app.stage.addChild(logContainer);

        // 공격자 상태 외곽 박스
        const smallAttackerBox = new PIXI.Graphics();
        smallAttackerBox.beginFill(0xffffff, 0.4);
        const smallAttackerBoxWidth = 365;
        const smallAttackerBoxHeight = 154;
        const smallAttackerBoxCornerRadius = 10;
        smallAttackerBox.drawRoundedRect(70, 70, smallAttackerBoxWidth, smallAttackerBoxHeight, smallAttackerBoxCornerRadius);
        smallAttackerBox.endFill();
        stateContainer.addChild(smallAttackerBox);

        // 수비자 상태 외곽 박스
        const smallDefenderBox = new PIXI.Graphics();
        smallDefenderBox.beginFill(0xffffff, 0.4);
        const smallDefenderBoxWidth = 365;
        const smallDefenderBoxHeight = 154;
        const smallDefenderBoxCornerRadius = 10;
        smallDefenderBox.drawRoundedRect(515, 70, smallDefenderBoxWidth, smallDefenderBoxHeight, smallDefenderBoxCornerRadius);
        smallDefenderBox.endFill();
        stateContainer.addChild(smallDefenderBox);

        // 배틀 로그 외곽 박스
        const battleLogBox = new PIXI.Graphics();
        battleLogBox.beginFill(0xffffff, 0.4);
        const battleLogBoxBoxWidth = 810;
        const battleLogBoxBoxHeight = 320;
        const battleLogBoxCornerRadius = 10;
        battleLogBox.drawRoundedRect(70, 250, battleLogBoxBoxWidth, battleLogBoxBoxHeight, battleLogBoxCornerRadius);
        battleLogBox.endFill();
        logContainer.addChild(battleLogBox);

        const displayBattleLogs = () => {
            const logContainer = new PIXI.Container();
            logContainer.y = 250;



            for (let i = 0; i < battleLog.length; i++) {
                setTimeout(() => {
                    const logText = new PIXI.Text(battleLog[i], {
                        fontSize: 15,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial',
                    })
                    logText.x = 80;
                    logText.y = i * 20;
                    logContainer.addChild(logText);
                }, 1000 * i)
            }
            logContainer.x = (810 - logContainer.width) / 2;
            logContainer.interactive = true;
            battleLogBox.addChild(logContainer);
        };

        // 공격자 수비자 상태 박스
        const addStateBox = (x, y, profileBoxPath, nickName,
                             currentHealth, maxHealth,
                             attackPower, defensePower, healthBarColor) => {

            const createHealthBar = (x, y, currentHealth, maxHealth, healthBarColor) => {
                const healthBar = new PIXI.Graphics();
                healthBar.beginFill(healthBarColor);
                const healthBarWidth = (currentHealth / maxHealth) * 228;
                const healthBarHeight = 40;
                const healthBarRadius = 10;
                healthBar.drawRoundedRect(x, y, healthBarWidth, healthBarHeight, healthBarRadius);
                healthBar.endFill();
                return healthBar;
            };
            // 체력바
            const healthBar = createHealthBar(x + 80, y + 50, currentHealth, maxHealth, healthBarColor)
            stateContainer.addChild(healthBar);

            // 프로필 사진
            if (profileBoxPath) {
                const profile = PIXI.Sprite.from(profileBoxPath);
                profile.width = 70;
                profile.height = 70;
                profile.x = x + 20;
                profile.y = y + 20;
                stateContainer.addChild(profile);
            }
            // 닉네임
            const nicknameText = new PIXI.Text(nickName, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            nicknameText.x = x + 80;
            nicknameText.y = y + 20;
            stateContainer.addChild(nicknameText);

            // 유저 수치
            const useState = new PIXI.Text(
                `공격력: ${attackPower} | 방어력: ${defensePower} `,
                {

                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial'

                });
            useState.x = x + 80;
            useState.y = y + 85;
            stateContainer.addChild(useState);

            const hpState = new PIXI.Text(
                `HP: [${currentHealth} / ${maxHealth}]`,
                {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial'
                })
            hpState.x = x + 80;
            hpState.y = y + 65;
            stateContainer.addChild(hpState);
        };
        addStateBox(
            50,
            50,
            Swap,
            '공격자',
            10000,
            10000,
            attackerAtkPower,
            attackerDefPower,
            '#FC5740'
        )
        addStateBox(
            500,
            50,
            Swap,
            '수비자',
            10000,
            10000,
            defenderAtkPower,
            defenderDefPower,
            '#5B7FFF'
        );

        setTimeout(() => {
            sendBattleDataToServer();
            displayBattleLogs();
        }, 2000);

    }, );


    return <div ref={pixiContainer} className="outlet-container"></div>

};

export default Battle;






















































import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useLocation } from 'react-router';
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';
import { api } from '../../../network/api';
const Battle = () => {
    const pixiContainer = useRef(null);
    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const location = useLocation();
    const data = location.state;

    const battleLogBox = new PIXI.Container();
    const stateContainer = new PIXI.Container();
    // Pixi Application 객체 생성
    useEffect(() => {
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);
        // 배경 이미지 추가
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // 컴포넌트 언마운트 시 app 객체 제거
        return () => {
            app.destroy();
        };
    }, []);
    // 전투 데이터 전송 및 로그 표시
    useEffect(() => {
        const sendBattleDataToServer = async () => {
            try {
                const requestBody = {
                    attacker: {
                        id: data.state.state.attacker.id,
                        nickName: data.state.state.attacker.nickName,
                        species: data.state.state.attacker.species,
                        profileImage: data.state.state.attacker.profileImage,
                        life: data.state.state.attacker.life,
                        maxLife: data.state.state.attacker.maxLife,
                        attackPower: data.state.state.attacker.attackPower,
                        defensePower: data.state.state.attacker.defensePower,
                        stringAttackTypeSkill: data.state.state.attacker.attackerAttackTypeSkill,
                        stringDefenseTypeSkill: data.state.state.attacker.attackerDefenseTypeSkill,
                        stringUtilityTypeSkill: data.state.state.attacker.attackerUtilityTypeSkill,
                        food: data.state.state.attacker.food,
                        gold : data.state.state.attacker.gold,
                        iron: data.state.state.attacker.iron,
                        wood: data.state.state.attacker.wood
                    },
                    defender: {
                        id: data.state.state.depender.id,
                        nickName: data.state.state.depender.nickName,
                        species: data.state.state.depender.species,
                        profileImage: data.state.state.depender.profileImage,
                        life: data.state.state.depender.life,
                        maxLife: data.state.state.depender.maxLife,
                        attackPower: data.state.state.depender.attackPower,
                        defensePower: data.state.state.depender.defensePower,
                        stringAttackTypeSkill: data.state.state.depender.defenderAttackTypeSkill,
                        stringDefenseTypeSkill: data.state.state.depender.defenderDefenseTypeSkill,
                        stringUtilityTypeSkill: data.state.state.depender.defenderUtilityTypeSkill,
                        food: data.state.state.depender.food,
                        gold : data.state.state.depender.gold,
                        iron: data.state.state.depender.iron,
                        wood: data.state.state.depender.wood
                    },
                };
                const stateToken = localStorage.getItem('stateToken');
                const response = await api('/api/v1/battle', 'POST', requestBody, {
                    headers: {
                        Authorization: `Bearer ${stateToken}`,
                    },
                });
                const logEntries = response.data;
                if (logEntries) {
                    setBattleLog(logEntries);
                }
            } catch (error) {
                console.error('Error sending battle data:', error);
            }
        };
        const displayBattleLogs = () => {
            const logContainer = new PIXI.Container();
            logContainer.y = 250;
            for (let i = 0; i < battleLog.length; i++) {
                setTimeout(() => {
                    const logText = new PIXI.Text(battleLog[i], {
                        fontSize: 15,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial',
                    });
                    logText.x = 80;
                    logText.y = i * 20;
                    logContainer.addChild(logText);
                }, 1000 * i);
            }
            logContainer.x = (810 - logContainer.width) / 2;
            logContainer.interactive = true;
            battleLogBox.addChild(logContainer);

        };
        // attackerAtkPower, attackerDefPower, defenderAtkPower, defenderDefPower 설정
        // 전투 데이터 전송 및 로그 표시
        setTimeout(() => {
            sendBattleDataToServer();
            displayBattleLogs();
        }, 2000);
    }, [attackerAtkPower, attackerDefPower, defenderAtkPower, defenderDefPower, battleLog]);
    // 상태 박스 추가
    useEffect(() => {
        const addStateBox = (
            x,
            y,
            profileBoxPath,
            nickName,
            currentHealth,
            maxHealth,
            attackPower,
            defensePower,
            healthBarColor
        ) => {
            const createHealthBar = (x, y, currentHealth, maxHealth, healthBarColor) => {
                const healthBar = new PIXI.Graphics();
                healthBar.beginFill(healthBarColor);
                const healthBarWidth = (currentHealth / maxHealth) * 228;
                const healthBarHeight = 40;
                const healthBarRadius = 10;
                healthBar.drawRoundedRect(x, y, healthBarWidth, healthBarHeight, healthBarRadius);
                healthBar.endFill();
                return healthBar;
            };
            const healthBar = createHealthBar(
                x + 80,
                y + 50,
                currentHealth,
                maxHealth,
                healthBarColor
            );
            stateContainer.addChild(healthBar);
            if (profileBoxPath) {
                const profile = PIXI.Sprite.from(profileBoxPath);
                profile.width = 70;
                profile.height = 70;
                profile.x = x + 20;
                profile.y = y + 20;
                stateContainer.addChild(profile);
            }
            const nicknameText = new PIXI.Text(nickName, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            nicknameText.x = x + 80;
            nicknameText.y = y + 20;
            stateContainer.addChild(nicknameText);
            const useState = new PIXI.Text(
                `공격력: ${attackPower} | 방어력: ${defensePower} `,
                {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                }
            );
            useState.x = x + 80;
            useState.y = y + 85;
            stateContainer.addChild(useState);
            const hpState = new PIXI.Text(`HP: [${currentHealth} / ${maxHealth}]`, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            hpState.x = x + 80;
            hpState.y = y + 65;
            stateContainer.addChild(hpState);
        };
        addStateBox(
            50,
            50,
            Swap,
            '공격자',
            10000,
            10000,
            attackerAtkPower,
            attackerDefPower,
            '#FC5740'
        );
        addStateBox(
            500,
            50,
            Swap,
            '수비자',
            10000,
            10000,
            defenderAtkPower,
            defenderDefPower,
            '#5B7FFF'
        );
    }, [attackerAtkPower, attackerDefPower, defenderAtkPower, defenderDefPower]);
    return <div ref={pixiContainer} className="outlet-container"></div>;
};
export default Battle;

















































import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useLocation } from 'react-router';
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';
import { api } from '../../../network/api';

const Battle = () => {
    const pixiContainer = useRef(null);

    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const location = useLocation();
    const data = location.state;

    const sendBattleDataToServer = async () => {
        try {
            const requestBody = {
                attacker: {
                    id: data.state.state.attacker.id,
                    nickName: data.state.state.attacker.nickName,
                    species: data.state.state.attacker.species,
                    profileImage: data.state.state.attacker.profileImage,
                    life: data.state.state.attacker.life,
                    maxLife: data.state.state.attacker.maxLife,
                    attackPower: data.state.state.attacker.attackPower,
                    defensePower: data.state.state.attacker.defensePower,
                    stringAttackTypeSkill: data.state.state.attacker.attackerAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.attacker.attackerDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.attacker.attackerUtilityTypeSkill,
                    food: data.state.state.attacker.food,
                    gold : data.state.state.attacker.gold,
                    iron: data.state.state.attacker.iron,
                    wood: data.state.state.attacker.wood
                },
                defender: {
                    id: data.state.state.depender.id,
                    nickName: data.state.state.depender.nickName,
                    species: data.state.state.depender.species,
                    profileImage: data.state.state.depender.profileImage,
                    life: data.state.state.depender.life,
                    maxLife: data.state.state.depender.maxLife,
                    attackPower: data.state.state.depender.attackPower,
                    defensePower: data.state.state.depender.defensePower,
                    stringAttackTypeSkill: data.state.state.depender.defenderAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.depender.defenderDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.depender.defenderUtilityTypeSkill,
                    food: data.state.state.depender.food,
                    gold : data.state.state.depender.gold,
                    iron: data.state.state.depender.iron,
                    wood: data.state.state.depender.wood
                },
            };
            const stateToken = localStorage.getItem('stateToken');
            const response = await api('/api/v1/battle', 'POST', requestBody, {
                headers: {
                    Authorization: `Bearer ${stateToken}`,
                },
            });
            const logEntries = response.data;
            if (logEntries) {
                setBattleLog(logEntries);
            }
        } catch (error) {
            console.error('Error sending battle data:', error);
        }
    };

    useEffect(() => {
        let app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);

        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const stateContainer = new PIXI.Container();
        app.stage.addChild(stateContainer);

        const logContainer = new PIXI.Container();
        app.stage.addChild(logContainer);

        const smallAttackerBox = new PIXI.Graphics();
        smallAttackerBox.beginFill(0xffffff, 0.4);
        const smallAttackerBoxWidth = 365;
        const smallAttackerBoxHeight = 154;
        const smallAttackerBoxCornerRadius = 10;
        smallAttackerBox.drawRoundedRect(
            70,
            70,
            smallAttackerBoxWidth,
            smallAttackerBoxHeight,
            smallAttackerBoxCornerRadius
        );
        smallAttackerBox.endFill();
        stateContainer.addChild(smallAttackerBox);

        const smallDefenderBox = new PIXI.Graphics();
        smallDefenderBox.beginFill(0xffffff, 0.4);
        const smallDefenderBoxWidth = 365;
        const smallDefenderBoxHeight = 154;
        const smallDefenderBoxCornerRadius = 10;
        smallDefenderBox.drawRoundedRect(
            515,
            70,
            smallDefenderBoxWidth,
            smallDefenderBoxHeight,
            smallDefenderBoxCornerRadius
        );
        smallDefenderBox.endFill();
        stateContainer.addChild(smallDefenderBox);

        const battleLogBox = new PIXI.Graphics();
        battleLogBox.beginFill(0xffffff, 0.4);
        const battleLogBoxBoxWidth = 810;
        const battleLogBoxBoxHeight = 320;
        const battleLogBoxCornerRadius = 10;
        battleLogBox.drawRoundedRect(
            70,
            250,
            battleLogBoxBoxWidth,
            battleLogBoxBoxHeight,
            battleLogBoxCornerRadius
        );
        battleLogBox.endFill();
        logContainer.addChild(battleLogBox);

        const displayBattleLogs = () => {
            const logContainer = new PIXI.Container();
            logContainer.y = 250;

            for (let i = 0; i < battleLog.length; i++) {
                setTimeout(() => {
                    const logText = new PIXI.Text(battleLog[i], {
                        fontSize: 15,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial',
                    });
                    logText.x = 80;
                    logText.y = i * 20;
                    logContainer.addChild(logText);
                }, 1000 * i);
            }
            logContainer.x = (810 - logContainer.width) / 2;
            logContainer.interactive = true;
            battleLogBox.addChild(logContainer);
        };

        const addStateBox = (
            x,
            y,
            profileBoxPath,
            nickName,
            currentHealth,
            maxHealth,
            attackPower,
            defensePower,
            healthBarColor
        ) => {
            const createHealthBar = (x, y, currentHealth, maxHealth, healthBarColor) => {
                const healthBar = new PIXI.Graphics();
                healthBar.beginFill(healthBarColor);
                const healthBarWidth = (currentHealth / maxHealth) * 228;
                const healthBarHeight = 40;
                const healthBarRadius = 10;
                healthBar.drawRoundedRect(x, y, healthBarWidth, healthBarHeight, healthBarRadius);
                healthBar.endFill();
                return healthBar;
            };

            const healthBar = createHealthBar(
                x + 80,
                y + 50,
                currentHealth,
                maxHealth,
                healthBarColor
            );
            stateContainer.addChild(healthBar);

            if (profileBoxPath) {
                const profile = PIXI.Sprite.from(profileBoxPath);
                profile.width = 70;
                profile.height = 70;
                profile.x = x + 20;
                profile.y = y + 20;
                stateContainer.addChild(profile);
            }

            const nicknameText = new PIXI.Text(nickName, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            nicknameText.x = x + 80;
            nicknameText.y = y + 20;
            stateContainer.addChild(nicknameText);

            const useState = new PIXI.Text(
                `공격력: ${attackPower} | 방어력: ${defensePower} `,
                {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                }
            );
            useState.x = x + 80;
            useState.y = y + 85;
            stateContainer.addChild(useState);

            const hpState = new PIXI.Text(`HP: [${currentHealth} / ${maxHealth}]`, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            hpState.x = x + 80;
            hpState.y = y + 65;
            stateContainer.addChild(hpState);
        };

        addStateBox(
            50,
            50,
            Swap,
            '공격자',
            10000,
            10000,
            attackerAtkPower,
            attackerDefPower,
            '#FC5740'
        );
        addStateBox(
            500,
            50,
            Swap,
            '수비자',
            10000,
            10000,
            defenderAtkPower,
            defenderDefPower,
            '#5B7FFF'
        );

        setTimeout(() => {
            sendBattleDataToServer();
            displayBattleLogs();
        }, 2000);

    }, [battleLog]);

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Battle;












// 로컬 스토리지 저장됨



import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useLocation } from 'react-router';

// 이미지
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';
import { api } from '../../../network/api';

const Battle = () => {
    const pixiContainer = useRef(null);

    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const location = useLocation();
    const data = location.state;

    const sendBattleDataToServer = async () => {
        try {
            const requestBody = {
                attacker: { /* ... */ },
                defender: { /* ... */ },
            };
            const stateToken = localStorage.getItem('stateToken');
            const response = await api('/api/v1/battle', 'POST', requestBody, {
                headers: {
                    Authorization: `Bearer ${stateToken}`,
                },
            });
            console.log(response);
            const logEntries = response.data;
            if (logEntries) {
                setBattleLog(logEntries);
                // 로컬스토리지에 로그 저장
                localStorage.setItem('battleLog', JSON.stringify(logEntries));
            }
        } catch (error) {
            console.error('Error sending battle data:', error);
        }
    };

    useEffect(() => {
        // 기본 배경크기 설정
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);

        // 화면 뒷 배경
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // 배틀 유저 상태 박스 담는 컨테이너
        const stateContainer = new PIXI.Container();
        app.stage.addChild(stateContainer);

        // 배틀 로그 담는 컨테이너
        const logContainer = new PIXI.Container();
        app.stage.addChild(logContainer);

        // 공격자 상태 외곽 박스
        const smallAttackerBox = new PIXI.Graphics();
        smallAttackerBox.beginFill(0xffffff, 0.4);
        const smallAttackerBoxWidth = 365;
        const smallAttackerBoxHeight = 154;
        const smallAttackerBoxCornerRadius = 10;
        smallAttackerBox.drawRoundedRect(
            70,
            70,
            smallAttackerBoxWidth,
            smallAttackerBoxHeight,
            smallAttackerBoxCornerRadius
        );
        smallAttackerBox.endFill();
        stateContainer.addChild(smallAttackerBox);

        // 수비자 상태 외곽 박스
        const smallDefenderBox = new PIXI.Graphics();
        smallDefenderBox.beginFill(0xffffff, 0.4);
        const smallDefenderBoxWidth = 365;
        const smallDefenderBoxHeight = 154;
        const smallDefenderBoxCornerRadius = 10;
        smallDefenderBox.drawRoundedRect(
            515,
            70,
            smallDefenderBoxWidth,
            smallDefenderBoxHeight,
            smallDefenderBoxCornerRadius
        );
        smallDefenderBox.endFill();
        stateContainer.addChild(smallDefenderBox);

        // 배틀 로그 외곽 박스
        const battleLogBox = new PIXI.Graphics();
        battleLogBox.beginFill(0xffffff, 0.4);
        const battleLogBoxBoxWidth = 810;
        const battleLogBoxBoxHeight = 320;
        const battleLogBoxCornerRadius = 10;
        battleLogBox.drawRoundedRect(
            70,
            250,
            battleLogBoxBoxWidth,
            battleLogBoxBoxHeight,
            battleLogBoxCornerRadius
        );
        battleLogBox.endFill();
        logContainer.addChild(battleLogBox);

        const displayBattleLogs = () => {
            const storedLogs = JSON.parse(localStorage.getItem('battleLog')) || [];

            for (let i = 0; i < storedLogs.length; i++) {
                setTimeout(() => {
                    const logText = new PIXI.Text(storedLogs[i], {
                        fontSize: 15,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial',
                    });
                    logText.x = 80;
                    logText.y = i * 20;
                    logContainer.addChild(logText);
                }, 1000 * i);
            }
            logContainer.x = (810 - logContainer.width) / 2;
            logContainer.interactive = true;
            battleLogBox.addChild(logContainer);
        };

        // 공격자 수비자 상태 박스
        const addStateBox = (
            x,
            y,
            profileBoxPath,
            nickName,
            currentHealth,
            maxHealth,
            attackPower,
            defensePower,
            healthBarColor
        ) => {
            const createHealthBar = (x, y, currentHealth, maxHealth, healthBarColor) => {
                const healthBar = new PIXI.Graphics();
                healthBar.beginFill(healthBarColor);
                const healthBarWidth = (currentHealth / maxHealth) * 228;
                const healthBarHeight = 40;
                const healthBarRadius = 10;
                healthBar.drawRoundedRect(x, y, healthBarWidth, healthBarHeight, healthBarRadius);
                healthBar.endFill();
                return healthBar;
            };

            const healthBar = createHealthBar(
                x + 80,
                y + 50,
                currentHealth,
                maxHealth,
                healthBarColor
            );
            stateContainer.addChild(healthBar);

            if (profileBoxPath) {
                const profile = PIXI.Sprite.from(profileBoxPath);
                profile.width = 70;
                profile.height = 70;
                profile.x = x + 20;
                profile.y = y + 20;
                stateContainer.addChild(profile);
            }

            const nicknameText = new PIXI.Text(nickName, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            nicknameText.x = x + 80;
            nicknameText.y = y + 20;
            stateContainer.addChild(nicknameText);

            const useState = new PIXI.Text(
                `공격력: ${attackPower} | 방어력: ${defensePower} `,
                {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                }
            );
            useState.x = x + 80;
            useState.y = y + 85;
            stateContainer.addChild(useState);

            const hpState = new PIXI.Text(
                `HP: [${currentHealth} / ${maxHealth}]`,
                {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                }
            );
            hpState.x = x + 80;
            hpState.y = y + 65;
            stateContainer.addChild(hpState);
        };

        addStateBox(
            50,
            50,
            Swap,
            '공격자',
            10000,
            10000,
            attackerAtkPower,
            attackerDefPower,
            '#FC5740'
        );
        addStateBox(
            500,
            50,
            Swap,
            '수비자',
            10000,
            10000,
            defenderAtkPower,
            defenderDefPower,
            '#5B7FFF'
        );

        setTimeout(() => {
            sendBattleDataToServer();
            displayBattleLogs();
        }, 2000);
    }, [battleLog]);

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Battle;









































import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useLocation } from 'react-router';
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';
import { api } from '../../../network/api';

const Battle = () => {
    const pixiContainer = useRef(null);

    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const location = useLocation();
    const data = location.state;

    const sendBattleDataToServer = async () => {
        try {
            const requestBody = {
                attacker: {
                    id: data.state.state.attacker.id,
                    nickName: data.state.state.attacker.nickName,
                    species: data.state.state.attacker.species,
                    profileImage: data.state.state.attacker.profileImage,
                    life: data.state.state.attacker.life,
                    maxLife: data.state.state.attacker.maxLife,
                    attackPower: data.state.state.attacker.attackPower,
                    defensePower: data.state.state.attacker.defensePower,
                    stringAttackTypeSkill: data.state.state.attacker.attackerAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.attacker.attackerDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.attacker.attackerUtilityTypeSkill,
                    food: data.state.state.attacker.food,
                    gold : data.state.state.attacker.gold,
                    iron: data.state.state.attacker.iron,
                    wood: data.state.state.attacker.wood
                },
                defender: {
                    id: data.state.state.depender.id,
                    nickName: data.state.state.depender.nickName,
                    species: data.state.state.depender.species,
                    profileImage: data.state.state.depender.profileImage,
                    life: data.state.state.depender.life,
                    maxLife: data.state.state.depender.maxLife,
                    attackPower: data.state.state.depender.attackPower,
                    defensePower: data.state.state.depender.defensePower,
                    stringAttackTypeSkill: data.state.state.depender.defenderAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.depender.defenderDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.depender.defenderUtilityTypeSkill,
                    food: data.state.state.depender.food,
                    gold : data.state.state.depender.gold,
                    iron: data.state.state.depender.iron,
                    wood: data.state.state.depender.wood
                },
            };
            const stateToken = localStorage.getItem('stateToken');
            const response = await api('/api/v1/battle', 'POST', requestBody, {
                headers: {
                    Authorization: `Bearer ${stateToken}`,
                },
            });
            const logEntries = response.data;
            if (logEntries) {
                setBattleLog(logEntries);
            }
        } catch (error) {
            console.error('Error sending battle data:', error);
        }
    };

    useEffect(() => {
        let app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);

        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const stateContainer = new PIXI.Container();
        app.stage.addChild(stateContainer);

        const logContainer = new PIXI.Container();
        app.stage.addChild(logContainer);

        const smallAttackerBox = new PIXI.Graphics();
        smallAttackerBox.beginFill(0xffffff, 0.4);
        const smallAttackerBoxWidth = 365;
        const smallAttackerBoxHeight = 154;
        const smallAttackerBoxCornerRadius = 10;
        smallAttackerBox.drawRoundedRect(
            70,
            70,
            smallAttackerBoxWidth,
            smallAttackerBoxHeight,
            smallAttackerBoxCornerRadius
        );
        smallAttackerBox.endFill();
        stateContainer.addChild(smallAttackerBox);

        const smallDefenderBox = new PIXI.Graphics();
        smallDefenderBox.beginFill(0xffffff, 0.4);
        const smallDefenderBoxWidth = 365;
        const smallDefenderBoxHeight = 154;
        const smallDefenderBoxCornerRadius = 10;
        smallDefenderBox.drawRoundedRect(
            515,
            70,
            smallDefenderBoxWidth,
            smallDefenderBoxHeight,
            smallDefenderBoxCornerRadius
        );
        smallDefenderBox.endFill();
        stateContainer.addChild(smallDefenderBox);

        const battleLogBox = new PIXI.Graphics();
        battleLogBox.beginFill(0xffffff, 0.4);
        const battleLogBoxBoxWidth = 810;
        const battleLogBoxBoxHeight = 320;
        const battleLogBoxCornerRadius = 10;
        battleLogBox.drawRoundedRect(
            70,
            250,
            battleLogBoxBoxWidth,
            battleLogBoxBoxHeight,
            battleLogBoxCornerRadius
        );
        battleLogBox.endFill();
        logContainer.addChild(battleLogBox);

        const displayBattleLogs = () => {
            const logContainer = new PIXI.Container();
            logContainer.y = 250;

            for (let i = 0; i < battleLog.length; i++) {
                setTimeout(() => {
                    const logText = new PIXI.Text(battleLog[i], {
                        fontSize: 15,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial',
                    });
                    logText.x = 80;
                    logText.y = i * 20;
                    logContainer.addChild(logText);
                }, 1000 * i);
            }
            logContainer.x = (810 - logContainer.width) / 2;
            logContainer.interactive = true;
            battleLogBox.addChild(logContainer);
        };

        const addStateBox = (
            x,
            y,
            profileBoxPath,
            nickName,
            currentHealth,
            maxHealth,
            attackPower,
            defensePower,
            healthBarColor
        ) => {
            const createHealthBar = (x, y, currentHealth, maxHealth, healthBarColor) => {
                const healthBar = new PIXI.Graphics();
                healthBar.beginFill(healthBarColor);
                const healthBarWidth = (currentHealth / maxHealth) * 228;
                const healthBarHeight = 40;
                const healthBarRadius = 10;
                healthBar.drawRoundedRect(x, y, healthBarWidth, healthBarHeight, healthBarRadius);
                healthBar.endFill();
                return healthBar;
            };

            const healthBar = createHealthBar(
                x + 80,
                y + 50,
                currentHealth,
                maxHealth,
                healthBarColor
            );
            stateContainer.addChild(healthBar);

            if (profileBoxPath) {
                const profile = PIXI.Sprite.from(profileBoxPath);
                profile.width = 70;
                profile.height = 70;
                profile.x = x + 20;
                profile.y = y + 20;
                stateContainer.addChild(profile);
            }

            const nicknameText = new PIXI.Text(nickName, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            nicknameText.x = x + 80;
            nicknameText.y = y + 20;
            stateContainer.addChild(nicknameText);

            const useState = new PIXI.Text(
                `공격력: ${attackPower} | 방어력: ${defensePower} `,
                {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                }
            );
            useState.x = x + 80;
            useState.y = y + 85;
            stateContainer.addChild(useState);

            const hpState = new PIXI.Text(`HP: [${currentHealth} / ${maxHealth}]`, {
                fontSize: 15,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            hpState.x = x + 80;
            hpState.y = y + 65;
            stateContainer.addChild(hpState);
        };

        addStateBox(
            50,
            50,
            Swap,
            '공격자',
            10000,
            10000,
            attackerAtkPower,
            attackerDefPower,
            '#FC5740'
        );
        addStateBox(
            500,
            50,
            Swap,
            '수비자',
            10000,
            10000,
            defenderAtkPower,
            defenderDefPower,
            '#5B7FFF'
        );

        // Ticker 설정
        const ticker = PIXI.Ticker.shared;
        ticker.autoStart = false;
        ticker.stop();

        let lastLogTime = 0; // 마지막 로그 추가 시간

        ticker.add((delta) => {
            if (delta > 2000 && battleLog.length > 0) {
                const logText = new PIXI.Text(battleLog.shift(), {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                });
                logText.x = 80;
                logText.y = logContainer.children.length * 20;
                logContainer.addChild(logText);

                lastLogTime = ticker.elapsedMS; // 로그 추가 시간 업데이트
            }

            app.renderer.render(app.stage);
        });

        setTimeout(() => {
            displayBattleLogs();
            sendBattleDataToServer();
            ticker.start();
        }, 2000);

    }, [battleLog]);

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Battle;
