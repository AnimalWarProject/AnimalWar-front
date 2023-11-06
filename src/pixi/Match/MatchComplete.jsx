import * as PIXI from 'pixi.js';
import back from './imgs/Rectangle12273.png';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';


const MatchComplete = () => {

    const canvasRef = useRef(null);

    const location = useLocation();
    const data = location.state;
    console.log(data);
    console.log(data.state.attacker);


    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            width: canvasWidth,
            height: canvasHeight,
        });

        // Use ref to append the PIXI application view to the DOM.
        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);

        }

        const background = PIXI.Sprite.from(back);
        background.width = app.screen.width;
        background.height = app.screen.height;


        app.stage.addChild(background);

        //하얀 내 반투명 박스
        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.4;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        app.stage.addChild(profileBox);


        //하얀 내 컬럼
        const array = ['닉네임', '공격력', '방어력', '  체 력', '  종 족', '  지 형'];
        const content = [data.state.attacker.nickName, data.state.attacker.attackPower, data.state.attacker.defensePower, data.state.attacker.life, data.state.attacker.species, data.state.attacker.landForm];


        for (let i = 0; i < 6; i++) {
            const box1 = new PIXI.Graphics();
            box1.beginFill(0xffffff, 0.5);
            const boxWidth = canvasWidth * 0.3;
            const boxHeight = canvasHeight * 0.08;
            box1.drawRoundedRect(100, 120 + i * 70, boxWidth, boxHeight, 20);
            profileBox.addChild(box1);

            const column = new PIXI.Graphics();
            column.beginFill(0xFC5740);
            const columnWidth = canvasWidth * 0.1;
            const columnHeight = canvasHeight * 0.07;
            column.drawRoundedRect(120, 122 + i * 70, columnWidth, columnHeight, 10);
            profileBox.addChild(column);

            // 텍스트 스프라이트를 생성합니다.
            const textStyle = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24, // 폰트 크기
                fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
            });

            const text = new PIXI.Text(array[i], textStyle);
            column.addChild(text);
            text.x = 127;
            text.y = 132 + i * 70;

            // 컨텐츠 텍스트 스프라이트

            const textStyle2 = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24, // 폰트 크기
                fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
            });
            const text2 = new PIXI.Text(content[i], textStyle2);

            text2.x = 230;
            text2.y = 135 + i * 70;
            column.addChild(text2);
        }



        //하얀 적 반투명 박스

        const profileBox2 = new PIXI.Graphics();
        profileBox2.beginFill(0xffffff, 0.5);
        const profileWidth2 = canvasWidth * 0.4;
        const profileHeight2 = canvasHeight * 0.85;
        profileBox.drawRoundedRect(100 + profileWidth2, 40, profileWidth, profileHeight, 40);

        app.stage.addChild(profileBox);

        const content2 = [data.state.depender.nickName, data.state.depender.attackPower, data.state.depender.defensePower, data.state.depender.life, data.state.depender.species, data.state.depender.landForm];


        for (let i = 0; i < 6; i++) {
            const box1 = new PIXI.Graphics();
            box1.beginFill(0xffffff, 0.5);
            const boxWidth = canvasWidth * 0.3;
            const boxHeight = canvasHeight * 0.08;
            box1.drawRoundedRect(510, 120 + i * 70, boxWidth, boxHeight, 20);
            profileBox.addChild(box1);

            const column = new PIXI.Graphics();
            column.beginFill(0x5B7FFF);
            const columnWidth = canvasWidth * 0.1;
            const columnHeight = canvasHeight * 0.07;
            column.drawRoundedRect(530, 122 + i * 70, columnWidth, columnHeight, 10);
            profileBox.addChild(column);

            // 텍스트 스프라이트를 생성합니다.
            const textStyle = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24, // 폰트 크기
                fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
            });

            const text = new PIXI.Text(array[i], textStyle);
            column.addChild(text);
            text.x = 537;
            text.y = 132 + i * 70;

            // 컨텐츠 텍스트 스프라이트

            const textStyle2 = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24, // 폰트 크기
                fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
            });
            const text2 = new PIXI.Text(content2[i], textStyle2);

            text2.x = 640;
            text2.y = 135 + i * 70;
            column.addChild(text2);
        }


    }, [])

    return <div ref={canvasRef}></div>;

}

export default MatchComplete;