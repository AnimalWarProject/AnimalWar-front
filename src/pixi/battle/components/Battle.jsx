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
        ticker.add(() => {
            app.renderer.render(app.stage);
        });

        setTimeout(() => {
            displayBattleLogs();
            sendBattleDataToServer();
            ticker.stop();
        }, 2000);

    }, [battleLog]);

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Battle;
