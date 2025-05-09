import back from "../image/Rectangle 12374.webp";
import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import upgrade1 from "../image/UPGRADE1 1.webp";
import upgrade2 from "../image/UPGRADE1 2.webp";
import upgrade3 from "../image/UPGRADE1 3.webp";
import {useLocation, useNavigate} from "react-router-dom";
import {api} from "../../../network/api";

const UpGradeLoading = () => {
    const accessToken = localStorage.getItem('accessToken');
    const canvasRef = useRef(null);
    const nav = useNavigate();
    const [cycleCount, setCycleCount] = useState(0);
    const [upgradeResult, setUpgradeResult] = useState();
    const location = useLocation();
    const { selectedItem, sendUserInfo } = location.state || {};
    const upgradeInfo = {
        userUUID: sendUserInfo,
        itemId : selectedItem.animal.animalId,
        buff : selectedItem.upgrade
    }
    const getData = async () => {
        try {
            const { data: response } = await api(`/api/v1/upgrade/animal`, 'POST', upgradeInfo);
            setUpgradeResult(response)
        } catch (error) {
            console.log(error + "강화 서비스 에러발생");
        }
    };
    const setGold = async () => {
        try {
            const { data: response } = await api(`/api/v1/user/upgrade`, 'POST', upgradeInfo, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
        } catch (error) {
        }
    };


    useEffect(() => {
        setGold();
        getData();
        // setGold();
        const canvasWidth = 960;
        const canvasHeight = 640;
        const app = new PIXI.Application({
            backgroundColor: 0x1099bb,
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }
        const background = PIXI.Sprite.from(back); 
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics(); 
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(70, 40, profileWidth, profileHeight, 40);

        const images = [upgrade1, upgrade2, upgrade3];
        const textureArray = [];
        for (let i = 0; i < images.length; i++) {
            textureArray.push(PIXI.Texture.from(images[i]));
        }
        const animatedSprite = new PIXI.AnimatedSprite(textureArray);
        animatedSprite.animationSpeed = 0.05;
        animatedSprite.play();
        animatedSprite.anchor.set(0.5);
        animatedSprite.x = canvasWidth / 2;
        animatedSprite.y = canvasHeight / 2;

        animatedSprite.onFrameChange = () => {
            if (animatedSprite.currentFrame === 0) {
                setCycleCount((prevCount) => prevCount + 1);
            }
        };

        app.stage.addChild(profileBox);
        app.stage.addChild(animatedSprite);
    }, []);

    useEffect(() => {
        if (cycleCount >= 3) {
            nav("/upgrade/result", { state: { selectedItem, upgradeResult } });
        }
    }, [cycleCount, nav]);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default UpGradeLoading;