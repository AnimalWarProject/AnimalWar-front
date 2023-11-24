import back from "../image/Rectangle 12374.webp";
import { useRef} from "react";
import * as PIXI from "pixi.js";
import success1 from "../image/result-1.webp";
import success2 from "../image/result-2.webp";
import success3 from "../image/result-3.webp";
import success4 from "../image/result-4.webp";
import success5 from "../image/result-5.webp";
import fail1 from "../image/result-5.webp";
import fail2 from "../image/result-5.webp";
import fail3 from "../image/result-5.webp";
import fail4 from "../image/result-5.webp";
import fail5 from "../image/result-5.webp";
import {useLocation, useNavigate} from "react-router-dom";
import {api} from "../../../network/api";
const UpGradeResult = () => {
    const accessToken = localStorage.getItem('accessToken');
    const INVImg = `${process.env.PUBLIC_URL}/objectImgs`;
    const location = useLocation();
    const nav = useNavigate();
    const selectedData = location.state;
    const canvasRef = useRef(null);

    const getData = async () => {
        try {
            const { data: response } = await api(`/api/v1/inventory/myanimal/${selectedData.animal.animalId}`, 'POST', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const canvasWidth = 960;
            const canvasHeight = 640;
            const textStyle = new PIXI.TextStyle({ // 글꼴
                fill: 0x0f1828,
                fontSize: 18,
                fontFamily: 'Arial',
                fontWeight: "bold",
            });

            const app = new PIXI.Application({
                backgroundColor: 0x1099bb,
                width: canvasWidth,
                height: canvasHeight,
            });

            if (canvasRef.current) {
                canvasRef.current.appendChild(app.view);
            }

            const background = PIXI.Sprite.from(back); // 뒷 배경사진
            background.width = app.screen.width;
            background.height = app.screen.height;


            const profileBox = new PIXI.Graphics(); // 큰 틀
            profileBox.beginFill(0xffffff, 0.5);
            const profileWidth = canvasWidth * 0.85;
            const profileHeight = canvasHeight * 0.85;
            profileBox.drawRoundedRect(70, 40, profileWidth, profileHeight, 40);

            const imagePath = `${INVImg}/animals/${selectedData.animal.species.toLowerCase()}/${selectedData.animal.imagePath}`;
            const result = PIXI.Sprite.from(imagePath);
            result.width = 270;
            result.height = 256;
            result.anchor.set(0.5)
            result.x = background.width / 2;
            result.y = background.height / 2;
            
            let images;
            if (response.upgrade > selectedData.upgrade) { // 조회한 데이터의 강화수 > location에서 받은 강화수ㅇ
                images = [success1, success2, success3, success4, success5]; // 강화 성공
                alert("강화성공")
            } else {
                images = [fail1, fail2, fail3, fail4, fail5]; // 강화 실패
                alert("강화실패")
            }
            const textureArray = [];
            for (let i = 0; i < images.length; i++) {
                textureArray.push(PIXI.Texture.from(images[i]));
            }
            const animatedSprite = new PIXI.AnimatedSprite(textureArray);
            animatedSprite.animationSpeed = 0.05;
            animatedSprite.width = 800;
            animatedSprite.height = 500;
            animatedSprite.play();
            animatedSprite.anchor.set(0.5);
            animatedSprite.x = background.width / 2;
            animatedSprite.y = background.height / 2;

            const outResultBtn = new PIXI.Graphics();
            outResultBtn.beginFill(0x3CFBFF, 0.7);
            const outResultBtnWidth = 130;
            const outResultBtnHeight = 36;
            outResultBtn.drawRoundedRect(700, 595, outResultBtnWidth, outResultBtnHeight, 10);
            const outResultText = new PIXI.Text('돌아가기', textStyle);
            outResultBtn.addChild(outResultText);
            outResultText.x = 730;
            outResultText.y = 605;
            const outResultContainer = new PIXI.Container();
            outResultContainer.interactive = true;
            outResultContainer.buttonMode = true;
            outResultContainer.addChild(outResultBtn);
            outResultContainer.on('pointertap', () => {
                nav('/upgrade');
            });

            app.stage.addChild(background);
            app.stage.addChild(profileBox);
            app.stage.addChild(animatedSprite);
            app.stage.addChild(result);
            app.stage.addChild(outResultContainer);

        } catch (error) {
            console.log(error + "에러발생");
        }
    };
    getData()

    return <div ref={canvasRef} className="outlet-container"></div>
};

export default UpGradeResult;