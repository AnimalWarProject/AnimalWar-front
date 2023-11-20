import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useLocation } from 'react-router';

// 이미지
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';
import {api} from "../../../network/api";

const Battle = () => {
    const pixiContainer = useRef(null);
    const [profileImage, setProfileImage] = useState(null);
    const [attackerHealth, setAttackerHealth] = useState(null);
    const [attackerMaxHealth, setAttackerMaxHealth] = useState(null);
    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [attackerAttackTypeSkill, setAttackerAttackTypeSkill] = useState(null);
    const [attackerDefenseTypeSkill, setAttackerDefenseTypeSkill] = useState(null);
    const [attackerUtilityTypeSkill, setAttackerUtilityTypeSkill] = useState(null);
    const [defenderHealth, setDefenderHealth] = useState(null);
    const [defenderMaxHealth, setDefenderMaxHealth] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [defenderAttackTypeSkill, setDefenderAttackTypeSkill] = useState(null);
    const [defenderDefenseTypeSkill, setDefenderDefenseTypeSkill] = useState(null);
    const [defenderUtilityTypeSkill, setDefenderUtilityTypeSkill] = useState(null);
    const [id, setId] = useState(null);
    const [nickName, setNickName] = useState(null);
    const [food, setFood] = useState(null);
    const [iron, setIron] = useState(null);
    const [gold, setGold] = useState(null);
    const [species, setSpecies] = useState(null);
    const [wood, setWood] = useState(null);

    const [battleLog, setBattleLog] = useState([])
    const location = useLocation();
    const data = location.state;
    console.log(data);

    const sendBattleDataToServer = async () => {
        try {
            const requestBody = {
                attacker: {
                    id: id,
                    nickName: nickName,
                    species: species,
                    profileImage: profileImage,
                    life: attackerHealth,
                    maxLife: attackerMaxHealth,
                    attackPower: attackerAtkPower,
                    defensePower: attackerDefPower,
                    attackerAttackTypeSkill: attackerAttackTypeSkill,
                    attackerDefenseTypeSkill: attackerDefenseTypeSkill,
                    attackerUtilityTypeSkill: attackerUtilityTypeSkill,
                    food: food,
                    gold : gold,
                    iron: iron,
                    wood: wood
                },
                defender: {
                    id: id,
                    nickName: nickName,
                    species: species,
                    profileImage: profileImage,
                    life: defenderHealth,
                    maxLife: defenderMaxHealth,
                    attackPower: attackerAtkPower,
                    defensePower: attackerDefPower,
                    defenderAttackTypeSkill: defenderAttackTypeSkill,
                    defenderDefenseTypeSkill: defenderDefenseTypeSkill,
                    defenderUtilityTypeSkill: defenderUtilityTypeSkill,
                    food: food,
                    gold : gold,
                    iron: iron,
                    wood: wood
                },
            };
            const stateToken = localStorage.getItem('stateToken');
            const response = await api('/api/vi/battle', 'POST', requestBody, {
                headers: {
                    Authorization: `Bearer ${stateToken}`,
                },
            });

            if (response.ok) {
                const battleLogs = await response.json();
                console.log('Battle data sent successfully')
            } else {
                console.error('Failed to send battle data. Server response:', response.status);
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
            for (let i = 0; i < battleLog.length; i++) {
                const logText = new PIXI.Text(battleLog[i], {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                })
                logText.x = 80;
                logText.y = 280 + i * 20; // Adjust Y position based on log index
                logContainer.addChild(logText);
            }
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
        }, [battleLog]);


    return <div ref={pixiContainer} className="outlet-container"></div>


};

export default Battle;
