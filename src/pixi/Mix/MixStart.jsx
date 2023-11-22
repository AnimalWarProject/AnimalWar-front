import {useEffect, useRef} from "react";
import * as PIXI from "pixi.js";
import mixBackground from "./imgs/Rectangle 12348.webp";
import inThePot from "./imgs/INTHEPOT 1.webp"
import {useHistory} from "react-router-use-history";
import {useLocation} from "react-router-dom";

const MixStart = () => {
    const canvasRef = useRef(null);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        const dataParam = new URLSearchParams(location.search).get("data");


        // dataParam 이 1이면 실패 니까 1이면 실패 페이지로 넘어가서 그냥 fail 하는데 다른 페이지로 넘어가기직전에 로컬스토리지 초기화


        //

        // dataParam 2이면 성공페이지로 가서 로컬스토리지에 들어있는 아이템을 보여주고(성공결과) 보여주고 다른 페이지로 넘어가기직전에 로컬스토리지 초기화

        // 로컬스토리지에 담긴 성공결과
        // const resultData = JSON.parse(localStorage.getItem('result'));


        const canvasWidth = 960;
        const canvasHeight = 640;
        // const history = useHistory();

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

        // 항아리 움직이기
        const container = new PIXI.Container();
        container.x = 455;
        container.y = 270;
        container.width = 615;
        container.height = 507;

        // add a bunch of sprites
        const pot = PIXI.Sprite.from(inThePot);
        pot.anchor.set(0.5);
        container.addChild(pot);
        app.stage.addChild(container);



        // let's create a moving shape
        const thing = new PIXI.Graphics();
        app.stage.addChild(thing);
        thing.x = app.screen.width / 2;
        thing.y = app.screen.height / 2;
        thing.lineStyle(0);

        container.mask = null; // 'container'를 'thing'으로 마스킹

        let movingCount = 0;

        app.ticker.add(()=>{
            pot.scale.x = 1 + Math.sin(movingCount) * 0.04;
            pot.scale.y = 1 + Math.cos(movingCount) * 0.04;
            movingCount += 0.1;
            thing.clear();
            thing.moveTo(-120 + Math.sin(movingCount) * 20, -100 + Math.cos(movingCount) * 20);
            thing.lineTo(120 + Math.cos(movingCount) * 20, -100 + Math.sin(movingCount) * 20);
            thing.lineTo(120 + Math.sin(movingCount) * 20, 100 + Math.cos(movingCount) * 20);
            thing.lineTo(-120 + Math.cos(movingCount) * 20, 100 + Math.sin(movingCount) * 20);
            thing.rotation = movingCount * 0.1;
        });

        const clickTest =  new PIXI.Text('이미지를 클릭하여 결과를 확인해주세요', textStyle);

        clickTest.x = container.x/2 + 80; // TODO x축 가운데 정렬
        clickTest.y = container.y + 270;
        profileBox.addChild(clickTest);

        // Feat : 합성 항이리 클릭 후 결과 반영
        // TODO : DB연결 후 확인 필요(화면에 넘어오는 거 보고 HttpStatus 반영 필요)
        pot.interactive = true;
        pot.on('pointertap', () => {
            if(dataParam == 1) {
                history.push("/mix3"); // 합성실패
            } else { // 합성 성공
                history.push("/mix4"); // 합성성공
            }
        });
    });









        return <div ref={canvasRef}></div>;
}

export default MixStart;