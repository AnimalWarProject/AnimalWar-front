import React, { useRef, useEffect } from 'react';
import * as PIXI from "pixi.js";
import backgroundImage from '../imgs/Rectangle 12290.png';
import berserkerImage from '../imgs/Berserker.png';
import bombDropImage from '../imgs/BombDrop.webp';
import ExecutionImage from '../imgs/Execution.webp';
import hiddenAceImage from '../imgs/HiddenAce.webp';
import poisonImage from '../imgs/Poison.webp';
import speedRunImage from '../imgs/SpeedRun.webp';
import transparency from '../imgs/Transparency.png';
import {ScrollBox} from "@pixi/ui";
import {Container, Graphics} from "pixi.js";

const Battle = () => {
    const pixiContainer = useRef(null);

    // 기본 배경크기 설정
    useEffect(() => {
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true
        });
        pixiContainer.current.appendChild(app.view);

        // 뒷 배경화면
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // 유형별 스킬 크기 및 위치 조정
        const addRoundedText = (text, x, y, width, height, cornerRadius, color) => {
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(0);
            graphics.beginFill('#FFC000');
            graphics.drawRoundedRect(x - width / 2, y - height / 2, width, height, cornerRadius);
            graphics.endFill();
            app.stage.addChild(graphics);

            // 글꼴
            const message = new PIXI.Text(text, {
                fontSize: 27,
                fill: 0x0f1828,
                align: 'center',
                fontWeight: 'normal',
                fontFamily: 'Arial'
            });
            message.anchor.set(0.5);
            message.x = x;
            message.y = y;
            app.stage.addChild(message);
        };
        addRoundedText('공격형 스킬', app.renderer.width / 5.5, app.renderer.height / 7, 277, 70, 40, 0x0f1828);
        addRoundedText('수비형 스킬', app.renderer.width / 1.99, app.renderer.height / 7, 277, 70, 40, 0x0f1828);
        addRoundedText('유틸형 스킬', app.renderer.width / 1.215, app.renderer.height / 7, 277, 70, 40, 0x0f1828);

        // 큰 박스를 담을 컨테이너
        const bigBoxContainer = new PIXI.Container();
        app.stage.addChild(bigBoxContainer);

        // 큰 스킬 박스
        const bigBox = new PIXI.Graphics();
        bigBox.beginFill(0xffffff, 0.5);
        const bigBoxWidth = 277;
        const bigBoxHeight = 480;
        const cornerRadius = 30;
        bigBox.drawRoundedRect(34, 140, bigBoxWidth, bigBoxHeight, cornerRadius);
        bigBox.endFill();
        bigBoxContainer.addChild(bigBox);

        let testArr = [];





        // 각 스킬들 설정
        const addSkillBox = (imageUrl, skillName, skillDescription) => {

            const container = new PIXI.Container();
            container.interactive = true;
            container.buttonMode = true;

            // 스킬 박스 위치 및 크기
            const box = new PIXI.Graphics();
            const cornerRadiusBox = 15; // 모서리 반경을 조정할 수 있습니다
            box.beginFill('#FFFFFF', 1.0);
            box.drawRoundedRect(0, 20, 243, 95, cornerRadiusBox);
            box.endFill();
            container.addChild(box);

            // 스킬사진 크기 및 위치
            const image = PIXI.Sprite.from(imageUrl);
            image.width = 65;
            image.height = 65;
            image.x = 4;
            image.y = 35;
            box.addChild(image);

            // 스킬 이름 크기 및 폰트
            const nameText = new PIXI.Text(skillName, {
                fontSize: 21,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial'
            });
            nameText.anchor.set(0, 0.5);
            nameText.x = 70;
            nameText.y = 48;
            box.addChild(nameText);


            // 스킬 설명 조정
            const descriptionText = new PIXI.Text(skillDescription, {
                fontSize: 13,
                fill: '#000000',
                align: 'justify',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 180,// 너비 조정을 위한 속성
                lineHeight: 16
            });
            descriptionText.anchor.set(0, 0.5);
            descriptionText.x = 70;
            descriptionText.y = 78;
            box.addChild(descriptionText);



            container.on('pointertap', () => {
                // 클릭된 스킬박스의 외부 테두리 스타일 변경
                box.lineStyle(4, 0xFF0000); // 테두리를 빨간색으로 변경하고 두께를 4로 설정
            });



            testArr.push(container);

        };


        addSkillBox(
            berserkerImage,
            '버서커',
            '자신의 체력이 20% 이하, 기본공격 3.5배 데미지 변경'
        );

        addSkillBox(
            bombDropImage,
            '폭탄 투하',
            '상대방 현재 체력의 20%에 해당하는 데미지'
        );
        addSkillBox(
            ExecutionImage,
            '처형',
            '5회의 공격이내 상대방이 10%의 체력 이하라면 처형'
        );
        addSkillBox(
            hiddenAceImage,
            '비장의 한발',
            '1회의 공격이 상대방보다 체력이 적다면 5배의 피해'
        );
        addSkillBox(
            poisonImage,
            '독약',
            '상대방의 최대 체력의 5%에 해당하는 데미지'
        );
        addSkillBox(
            speedRunImage,
            '빨리감기',
            '상대방의 최대 체력의 5%에 해당하는 데미지'
        );

        // addSkillBox(
        //     transparency,
        //     '스킬 준비중',
        //     '스킬 준비 중...'
        // );



        const scBox = new ScrollBox({
            width: 254,
            height: 480,
            items: testArr,
            radius : 25,
            elementsMargin: 20,
            vertPadding: 1
            // padding: 10
        });

        scBox.x = 50; // x 좌표
        scBox.y = 134; // y 좌표

        bigBox.addChild(scBox);

    }, []);

    return <div ref={pixiContainer} />;
};

export default Battle;