import {useEffect, useRef} from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/Rectangle 12299.png";
import randomEgg from "../imgs/RANDOMEGG 2.png";
import {useNavigate} from "react-router-dom";

const DrawLoading = () => {
    const canvasRef = useRef(null);
    const nav = useNavigate();

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            background: '#1099bb',
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

        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        const profileInnerBox = new PIXI.Graphics(); // 작은 틀
        profileInnerBox.beginFill(0xffffff, 0.5);
        const InnerBoxWidth = 450;
        const InnerBoxHeight = 484;
        profileBox.drawRoundedRect(250, 70, InnerBoxWidth, InnerBoxHeight, 40);

        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold"
        });

        const oneDrawText = new PIXI.Text('결과 화면.', textStyle);
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
            alert("결과 보여주기 클릭")

            // axios.post
        });
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


        // Cleanup on component unmount
        return () => {
            app.destroy();
        };
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default DrawLoading;