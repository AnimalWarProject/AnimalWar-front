import {useEffect, useRef} from "react";
import popMixSuccess from './imgs/SUCCESSMIX 1.webp'
import * as PIXI from "pixi.js";
import mixBackground from "./imgs/Rectangle 12348.webp";
import {ButtonContainer} from "@pixi/ui";
import {useHistory} from "react-router-use-history";
import qqq from './imgs/qqq.jpg';

const MixSuccess = () => {
    const canvasRef = useRef(null);
    const history = useHistory();


    useEffect(() => {


        const resultData = JSON.parse(localStorage.getItem('result'));

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
        profileBox.beginFill(0xffffff, 0.00001);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);
        app.stage.addChild(profileBox);


        const pop = PIXI.Sprite.from(popMixSuccess);
        pop.anchor.set(0.5);
        pop.x = canvasWidth / 2 -20; // 스프라이트를 수평 중앙에 배치
        pop.y = canvasHeight / 2 + 10; // 스프라이트를 수직 중앙에 배치


        // 이미지 경로 지정
        const getObjectImagePath = (resultData) => {
                return resultData.entityType == 'ANIMAL'?
                 `/objectImgs/${resultData.entityType}s/${resultData.species}/${resultData.imagePath}`
                 : `/objectImgs/${resultData.entityType}s/${resultData.imagePath}`;
        };

        const mixSuccessResult = PIXI.Sprite.from(getObjectImagePath(resultData));
        mixSuccessResult.anchor.set(0.5); // 해당 스프라이트의 앵커를 (1, 1)로 설정 = 프라이트의 오른쪽 아래 모서리가 앵커가 되어 스프라이트를 중심
        mixSuccessResult.x = canvasWidth / 2 ; // 스프라이트를 수평 중앙에 배치
        mixSuccessResult.y = canvasHeight / 2 - 30; // 스프라이트를 수직 중앙에 배치
        mixSuccessResult.width = 230;
        mixSuccessResult.height = 246;

        profileBox.addChild(pop)
        profileBox.addChild(mixSuccessResult)
        profileBox.beginFill(0xffffff, 0.5);



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


        // prepare circle texture, that will be our brush
        const brush = new PIXI.Graphics()
            .beginFill(0xffffff)
            .drawCircle(0, 0, 50);

        // Create a line that will interpolate the drawn points
        const line = new PIXI.Graphics();

        PIXI.Assets.add('t1', qqq);
        PIXI.Assets.add('t2', 'https://pixijs.com/assets/bg_rotate.jpg');
        PIXI.Assets.load(['t1', 't2']).then(setup);

        function setup()
        {
            const { width, height } = app.screen;
            const stageSize = { width, height };
            stageSize.width = 750;
            stageSize.height = 500;

            // 잔디 그림..
            const background = Object.assign(PIXI.Sprite.from('t1'), stageSize);
            background.x = 100;
            background.y = 60;

            // 결과..
            const imageToReveal = Object.assign(PIXI.Sprite.from(mixBackground), profileBox);
            const renderTexture = PIXI.RenderTexture.create(stageSize);
            const renderTextureSprite = new PIXI.Sprite(renderTexture);

            renderTextureSprite.x = 100;
            renderTextureSprite.y = 60;

            imageToReveal.mask = renderTextureSprite;


            app.stage.addChild(
                background,
                imageToReveal,
                renderTextureSprite,
            );

            app.stage.eventMode = 'static';
            app.stage.hitArea = app.screen;
            app.stage
                .on('pointerdown', pointerDown)
                .on('pointerup', pointerUp)
                .on('pointerupoutside', pointerUp)
                .on('pointermove', pointerMove);

            let dragging = false;
            let lastDrawnPoint = null;

            function pointerMove({ global: { x, y } })
            {
                if (dragging)
                {
                    brush.position.set(x, y);
                    app.renderer.render(brush, {
                        renderTexture,
                        clear: false,
                        skipUpdateTransform: false,
                    });
                    // Smooth out the drawing a little bit to make it look nicer
                    // this connects the previous drawn point to the current one
                    // using a line
                    if (lastDrawnPoint)
                    {
                        line
                            .clear()
                            .lineStyle({ width: 100, color: 0xffffff })
                            .moveTo(lastDrawnPoint.x, lastDrawnPoint.y)
                            .lineTo(x, y);
                        app.renderer.render(line, {
                            renderTexture,
                            clear: false,
                            skipUpdateTransform: false,
                        });
                    }
                    lastDrawnPoint = lastDrawnPoint || new PIXI.Point();
                    lastDrawnPoint.set(x, y);
                }
            }

            function pointerDown(event)
            {
                dragging = true;
                pointerMove(event);
            }

            function pointerUp(event)
            {
                dragging = false;
                lastDrawnPoint = null;
            }
        }


    }, [])

    return <div ref={canvasRef}></div>;
}

export default MixSuccess;