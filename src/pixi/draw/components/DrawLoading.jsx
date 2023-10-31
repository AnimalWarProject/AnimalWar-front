import {useEffect, useRef} from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/Rectangle 12299.png";
import randomEgg from "../imgs/RANDOMEGG 2.png";
import randomEgg1 from "../imgs/egg-1.png";
import randomEgg2 from "../imgs/egg-1-2.png";
import randomEgg3 from "../imgs/egg-2.png";
import randomEgg4 from "../imgs/egg-3.png";
import smokeImage from "../action/smoke.png";
import {useNavigate} from "react-router-dom";

const DrawLoading = () => {
    const canvasRef = useRef(null);
    const nav = useNavigate();



    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;
        const smokeTexture = PIXI.Texture.from(smokeImage);

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
            const imageNames = [randomEgg, randomEgg1, randomEgg2, randomEgg3, randomEgg4];
            const imageTextures = imageNames.map((imageName) =>
                PIXI.Texture.from(imageName)
            );

            const imageSprite = new PIXI.Sprite(imageTextures[0]);
            imageSprite.anchor.set(0.5);
            imageSprite.x = 475; // 이미지의 초기 x 위치
            imageSprite.y = 300; // 이미지의 초기 y 위치
            profileBox.addChild(imageSprite);

            let currentIndex = 0;

            const showNextImage = () => {
                if (currentIndex < imageTextures.length) {
                    imageSprite.texture = imageTextures[currentIndex];
                    currentIndex++;

                    setTimeout(showNextImage, 1000); // 이미지 변경 간격 (1초)
                } else {
                    // 모든 이미지를 보여준 후에 마지막 이미지를 제거
                    profileBox.removeChild(imageSprite);
                }
            };

            showNextImage();
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
        function animateFirework(firework) {
            // 확대 애니메이션 및 투명도 효과
            firework.scale.x += 0.010;
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