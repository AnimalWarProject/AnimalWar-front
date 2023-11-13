import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import backgroundImage from '../imgs/Rectangle 12290.png';

const Battle = () => {
    const pixiContainer = useRef(null);
    const [defenderHealth, setDefenderHealth] = useState(100);
    const [attackerHealth, setAttackerHealth] = useState(100);

    useEffect(() => {
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });

        pixiContainer.current.appendChild(app.view);

        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);



        // 배틀 큰박스 담는 컨테이너
        const bigBoxContainer = new PIXI.Container();
        app.stage.addChild(bigBoxContainer);

        // 배틀 큰박스
        const bigBox = new PIXI.Graphics();
        bigBox.beginFill(0xffffff, 0.2);
        const bigBoxWidth = 849;
        const bigBoxHeight = 542;
        const cornerRadius = 10;
        bigBox.drawRoundedRect(50, 50, bigBoxWidth, bigBoxHeight, cornerRadius);
        bigBox.endFill();
        bigBoxContainer.addChild(bigBox);

        // 배틀 체력 박스 담는 컨테이너
        const smallBoxContainer = new PIXI.Container();
        bigBoxContainer.addChild(smallBoxContainer);
        
        // 배틀 체력 박스
        const smallBox = new PIXI.Graphics();
        smallBox.beginFill(0xffffff, 0.4);
        const smallWidth = 365;
        const smallHeight = 154;
        const smallRadius = 10;
        smallBox.drawRoundedRect(75, 75, smallWidth, smallHeight, smallRadius);
        smallBox.endFill();
        smallBoxContainer.addChild(smallBox);


        // 공격자의 체력바
        const attackerHealthBar = createHealthBar('#FC5740');
        attackerHealthBar.x = 180; // 적절한 위치로 조정
        attackerHealthBar.y = 100; // 적절한 위치로 조정
        smallBoxContainer.addChild(attackerHealthBar);

        // 수비자의 체력바
        const defenderHealthBar = createHealthBar('#5B7FFF');
        defenderHealthBar.x = 550; // 적절한 위치로 조정
        defenderHealthBar.y = 100; // 적절한 위치로 조정
        bigBoxContainer.addChild(defenderHealthBar);


        // 시뮬레이션을 위한 함수 (실제 게임 로직으로 대체 필요)
        const simulateAttack = () => {
            const defenderDamage = 20; // 수비자에게 입히는 피해량
            setDefenderHealth((prevHealth) => Math.max(0, prevHealth - defenderDamage));

            const attackerDamage = 15; // 공격자에게 입히는 피해량
            setAttackerHealth((prevHealth) => Math.max(0, prevHealth - attackerDamage));
        };

        // simulateAttack()를 호출하여 공격을 시뮬레이션합니다. 실제 게임 로직에 맞게 트리거해야 합니다.
        simulateAttack();
    }, []);

    // 체력바를 생성하는 함수
    const createHealthBar = (color) => {
        const healthBar = new PIXI.Graphics();
        healthBar.beginFill(color);
        const healthBarWidth = 228;
        const healthBarHeight = 50;
        const healthBarRadius = 10;
        healthBar.drawRoundedRect(0, 0, healthBarWidth, healthBarHeight, healthBarRadius);
        healthBar.endFill();
        return healthBar;
    };

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Battle;
