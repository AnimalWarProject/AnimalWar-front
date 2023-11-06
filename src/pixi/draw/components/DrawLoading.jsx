import {useEffect, useRef, useState} from 'react';
import * as PIXI from 'pixi.js';
import back from '../imgs/Rectangle 12299.png';
import randomEgg from '../imgs/RANDOMEGG 2.png';
import randomBuilding from '../imgs/RandomBuilding.png';
import smokeImage from '../action/smoke.png';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

const DrawLoading = () => {
    const canvasRef = useRef(null);
    const nav = useNavigate();
    const location = useLocation();
    const drawData = location.state;
    const qty = drawData.qty;
    const type = drawData.type;

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;
        const smokeTexture = PIXI.Texture.from(smokeImage);
        const app = new PIXI.Application({
            background: '#1099bb',
            width: canvasWidth,
            height: canvasHeight,
        });
        const drawRequest = {
            cnt: qty,
            userUUID: "bc654f15-a1a3-4b97-a32f-5390ca92d0f2"
        };

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(back);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        const profileInnerBox = new PIXI.Graphics(); // 작은 틀
        profileInnerBox.beginFill(0xffffff, 0.5);
        const InnerBoxWidth = 450;
        const InnerBoxHeight = 484;
        profileInnerBox.drawRoundedRect(250, 70, InnerBoxWidth, InnerBoxHeight, 40);

        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: 'bold',
        });

        const oneDrawText = new PIXI.Text('클릭하면 결과를 확인할 수 있습니다.', textStyle);
        profileBox.addChild(oneDrawText);
        oneDrawText.x = 330;
        oneDrawText.y = 450;
        app.stage.addChild(profileBox);

        const randomEggTexture = PIXI.Texture.from(randomEgg); // randomEgg 이미지
        const randomEggSprite = new PIXI.Sprite(randomEggTexture);
        // 설정된 중심점을 중앙으로 이동
        randomEggSprite.anchor.set(0.5);
        randomEggSprite.width = 350;
        randomEggSprite.height = 300;
        randomEggSprite.x = 475; // 초기 x 위치
        randomEggSprite.y = 300; // 초기 y 위치
        randomEggSprite.interactive = true;
        randomEggSprite.buttonMode = true;
        randomEggSprite.on('pointertap', () => {
            axios.post("http://localhost:8083/api/v1/draw/animal", drawRequest)
                .then((response) => {
                    // 결과가 빈 객체로 오는 경우, response.data를 살펴봐야 할 수 있음
                    console.log("loading data : ", response.data);
                    nav('/draw/result', { state: response.data });
                })
                .catch((error) => {
                    console.error("데이터 가져오기 실패: ", error);
                });
        });

        if (type === 'animal') {
            randomEggSprite.texture = PIXI.Texture.from(randomEgg);
        } else {
            randomEggSprite.texture = PIXI.Texture.from(randomBuilding);
        }

        profileBox.addChild(randomEggSprite);

        // Create variables for animation
        let rotationSpeed = 0.01; // 회전 속도
        let direction = 1; // 1은 우측, -1은 좌측

        app.ticker.add(() => {
            // 회전 방향에 따라 기울이기
            randomEggSprite.rotation += rotationSpeed * direction;

            // 좌우로 기울이다가 일정 각도에 도달하면 방향을 바꿈
            if (randomEggSprite.rotation >= 0.2 || randomEggSprite.rotation <= -0.2) {
                direction *= -1;
            }
        });
        function animateFirework(firework) {
            // 확대 애니메이션 및 투명도 효과
            firework.scale.x += 0.01;
            firework.scale.y += 0.01;
            firework.alpha -= 0.005;

            // 애니메이션이 끝나면 제거
            if (firework.alpha <= 0) {
                app.stage.removeChild(firework);
            }
        }

        // Cleanup on component unmount
        return () => {
            app.destroy();
        };
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default DrawLoading;
