import {useEffect, useRef} from "react";
import popMixSuccess from './imgs/SUCCESSMIX 1.webp'
import * as PIXI from "pixi.js";
import mixBackground from "./imgs/Rectangle 12348.webp";
import pig from './imgs/PIG 5.webp'
import {ButtonContainer} from "@pixi/ui";
import {useHistory} from "react-router-use-history";

const MixSuccess = () => {
    const canvasRef = useRef(null);
    const history = useHistory();


    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        // 글꼴
        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold",
        });

        const app = new PIXI.Application({
            background: '#1099bb',
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(mixBackground);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);
        app.stage.addChild(profileBox);

        // 성공 이미지
        // const container = new PIXI.Container();
        // container.x = 455;
        // container.y = 270;
        // container.width = 615;
        // container.height = 507;
        // app.stage.addChild(container);


        // add a bunch of sprites
        const pop = PIXI.Sprite.from(popMixSuccess);
        pop.anchor.set(0.5);
        pop.x = canvasWidth / 2 -20; // 스프라이트를 수평 중앙에 배치
        pop.y = canvasHeight / 2 + 10; // 스프라이트를 수직 중앙에 배치
        // container.addChild(pop);

        const mixSuccessResult = PIXI.Sprite.from(pig);
        mixSuccessResult.anchor.set(0.5); // 해당 스프라이트의 앵커를 (1, 1)로 설정 = 프라이트의 오른쪽 아래 모서리가 앵커가 되어 스프라이트를 중심
        mixSuccessResult.x = canvasWidth / 2 ; // 스프라이트를 수평 중앙에 배치
        mixSuccessResult.y = canvasHeight / 2 - 30; // 스프라이트를 수직 중앙에 배치
        mixSuccessResult.width = 230;
        mixSuccessResult.height = 246;
        // container.addChild(mixSuccessResult);

        profileBox.addChild(pop)
        profileBox.addChild(mixSuccessResult)




        // Feat 또 합성하기 버튼
        const mixStartBtn = new ButtonContainer(
            new PIXI.Graphics()
                .beginFill(0x00ffff, 0.8)
                .drawRoundedRect(720, 590, 150, 40, 40))

        const mixStartText = new PIXI.Text('또 합성하기', textStyle);
        mixStartBtn.addChild(mixStartText);

        // 가운데 정렬을 위해 텍스트의 x, y 좌표를 조정
        mixStartText.x = 750
        mixStartText.y = 600

        mixStartBtn.onPress.connect(() => {
            history.push("/mix");
        });

        background.addChild(mixStartBtn);

    })





    return <div ref={canvasRef}></div>;
}

export default MixSuccess;