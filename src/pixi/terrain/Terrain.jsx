import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { api } from '../../network/api';
import terrainBackground from './imgs/TerrainBackground.webp';
import goldImage from './imgs/GoldBag.webp';
import LandImage from '../../common/imgs/Land.webp';
import SeaImage from '../../common/imgs/Sea.webp';
import MountainImage from '../../common/imgs/Mountain.webp';
import powImage from './imgs/PowImage.webp';
import { Assets } from '@pixi/assets';
import { Spine } from 'pixi-spine';
import '@pixi-spine/loader-3.8';

const Terrain = () => {
    const appRef = useRef(null);
    const canvasRef = useRef(null);
    const magicianRef = useRef(null);
    const [resources, setResources] = useState({
        gold: 0,
        land: 0,
        sea: 0,
        mountain: 0,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const { data: userResponse } = await api('/api/v1/user', 'GET', null, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setResources({
                    gold: userResponse.gold,
                    land: userResponse.land,
                    sea: userResponse.sea,
                    mountain: userResponse.mountain,
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // 마법사 애니메이션

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        if (!appRef.current) {
            const app = new PIXI.Application({
                background: '#1099bb',
                width: canvasWidth,
                height: canvasHeight,
            });

            if (canvasRef.current) {
                canvasRef.current.appendChild(app.view);
            }
            appRef.current = app;

            return () => {

                Assets.unload('magician');
                Assets.unload('magicianAtlas');


                if (magicianRef.current) {
                    try {
                        magicianRef.current.destroy();
                        magicianRef.current = null; 
                    } catch (error) {
                        console.error('마법사 객체 파괴 중 오류 발생:', error);
                    }
                }


                app.destroy(true, {
                    children: true, 
                    texture: true, 
                    baseTexture: true,
                });
            };
        }
    }, []);

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        function explodePow(x, y) {
            const texture = PIXI.Texture.from(powImage);
            const pow = new PIXI.Sprite(texture);
            pow.anchor.set(0.5);
            pow.x = 600;
            pow.y = 300;
            pow.scale.set(0.1);
            pow.alpha = 1;
            appRef.current.stage.addChild(pow);

            const explodeAnimation = () => {
                if (pow.alpha > 0) {
                    pow.scale.x += 0.1;
                    pow.scale.y += 0.1;
                    pow.alpha -= 0.05;
                } else {
                    appRef.current.stage.removeChild(pow);
                    appRef.current.ticker.remove(explodeAnimation);
                }
            };

            appRef.current.ticker.add(explodeAnimation);
        }

        //배경이미지
        const background = PIXI.Sprite.from(terrainBackground);
        background.width = appRef.current.screen.width;
        background.height = appRef.current.screen.height;
        appRef.current.stage.addChild(background);

        //배경안 회색틀
        const largeBox = new PIXI.Graphics();
        largeBox.beginFill(0xffffff, 0.5);
        const largeBoxWidth = canvasWidth * 0.85;
        const largeBoxHeight = canvasHeight * 0.85;
        largeBox.drawRoundedRect(62, 40, largeBoxWidth, largeBoxHeight, 40);
        appRef.current.stage.addChild(largeBox);

        // 우측 ui박스
        const uiContainer = new PIXI.Container();
        uiContainer.x = appRef.current.screen.width - 500;
        uiContainer.y = 120;
        appRef.current.stage.addChild(uiContainer);

        // UI 배경
        const uiBackground = new PIXI.Graphics();
        uiBackground.beginFill(0xffffff, 0.5);
        uiBackground.drawRoundedRect(0, 0, 400, 440, 16);
        uiBackground.endFill();
        uiContainer.addChild(uiBackground);

        // 골드 박스
        const goldContainer = new PIXI.Container();
        goldContainer.x = appRef.current.screen.width - 500; // UI 컨테이너의 x 위치
        goldContainer.y = 60; // UI 컨테이너의 y 위치
        appRef.current.stage.addChild(goldContainer);

        // 골드박스 배경
        const goldBackground = new PIXI.Graphics();
        goldBackground.beginFill(0xffffff, 0.5);
        goldBackground.drawRoundedRect(0, 0, 200, 54, 16);
        goldBackground.endFill();
        goldContainer.addChild(goldBackground);

        //골드이미지
        const gold = PIXI.Sprite.from(goldImage);
        gold.anchor.set(0.1);
        gold.x = 13;
        gold.y = 7;
        gold.scale.x = 0.25;
        gold.scale.y = 0.25;
        goldContainer.addChild(gold);

        //육지 박스
        const landPillBox = new PIXI.Graphics();
        const pillWidth = 316;
        const pillHeight = 95;
        const borderRadius = pillHeight / 2;
        landPillBox.beginFill(0xffffff, 0.5);
        landPillBox.drawRoundedRect(0, 0, pillWidth, pillHeight, borderRadius);
        landPillBox.endFill();
        landPillBox.x = 42;
        landPillBox.y = 35;
        uiContainer.addChild(landPillBox);

        // 바다 박스
        const seaPillBox = new PIXI.Graphics();
        seaPillBox.beginFill(0xffffff, 0.5);
        seaPillBox.drawRoundedRect(0, 0, pillWidth, pillHeight, borderRadius);
        seaPillBox.endFill();
        seaPillBox.x = 42;
        seaPillBox.y = 145;
        uiContainer.addChild(seaPillBox);

        // 산지 박스
        const mountainPillBox = new PIXI.Graphics();
        mountainPillBox.beginFill(0xffffff, 0.5);
        mountainPillBox.drawRoundedRect(0, 0, pillWidth, pillHeight, borderRadius);
        mountainPillBox.endFill();
        mountainPillBox.x = 42;
        mountainPillBox.y = 255;
        uiContainer.addChild(mountainPillBox);

        // 육지 이미지
        const landImage = PIXI.Sprite.from(LandImage);
        landImage.x = 43;
        landImage.y = 38;
        landImage.scale.x = 0.3;
        landImage.scale.y = 0.3;
        uiContainer.addChild(landImage);

        // 바다 이미지
        const seaImage = PIXI.Sprite.from(SeaImage);
        seaImage.x = 43;
        seaImage.y = 148;
        seaImage.scale.x = 0.3;
        seaImage.scale.y = 0.3;
        uiContainer.addChild(seaImage);

        // 산지 이미지
        const mountainImage = PIXI.Sprite.from(MountainImage);
        mountainImage.x = 43;
        mountainImage.y = 258;
        mountainImage.scale.x = 0.3;
        mountainImage.scale.y = 0.3;
        uiContainer.addChild(mountainImage);

        // 육지바다산 텍스트 설정
        const landFormTextStyle = { fontFamily: 'Arial', fontSize: 20, fill: 'black' };

        // '육지' 텍스트
        const landText = new PIXI.Text('육지', landFormTextStyle);

        // '바다' 텍스트
        const seaText = new PIXI.Text('바다', landFormTextStyle);

        // '산지' 텍스트
        const mountainText = new PIXI.Text('산', landFormTextStyle);

        // '육지' 테두리 상자
        const padding = 9;
        const landBorderBox = new PIXI.Graphics();
        landBorderBox.beginFill(0xffffff, 0.5);
        landBorderBox.lineStyle(1, 0x000000, 1);
        landBorderBox.drawRoundedRect(0, 0, 81, 39, 16);
        landBorderBox.endFill();
        landBorderBox.x = 160;
        landBorderBox.y = 65;
        landText.x = padding + 10;
        landText.y = padding;
        uiContainer.addChild(landBorderBox);
        landBorderBox.addChild(landText);

        // '바다' 테두리 상자
        const seaBorderBox = new PIXI.Graphics();
        seaBorderBox.beginFill(0xffffff, 0.5);
        seaBorderBox.lineStyle(1, 0x000000, 1);
        seaBorderBox.drawRoundedRect(0, 0, 81, 39, 16);
        seaBorderBox.endFill();
        seaBorderBox.x = 160;
        seaBorderBox.y = 175;
        seaText.x = padding + 10;
        seaText.y = padding;
        uiContainer.addChild(seaBorderBox);
        seaBorderBox.addChild(seaText);

        // '산' 테두리 상자
        const mountainBorderBox = new PIXI.Graphics();
        mountainBorderBox.beginFill(0xffffff, 0.5);
        mountainBorderBox.lineStyle(1, 0x000000, 1);
        mountainBorderBox.drawRoundedRect(0, 0, 81, 39, 16);
        mountainBorderBox.endFill();
        mountainBorderBox.x = 160;
        mountainBorderBox.y = 285;
        mountainText.x = padding + 20;
        mountainText.y = padding;
        uiContainer.addChild(mountainBorderBox);
        mountainBorderBox.addChild(mountainText);

        async function loadSpineAnimation() {
            try {
                if (!Assets.resolver.hasKey('magician')) {
                    Assets.add({ alias: 'magician', src: '../terrainAni/Magician.json' });
                }

                if (!Assets.resolver.hasKey('magicianAtlas')) {
                    Assets.add({ alias: 'magicianAtlas', src: '../terrainAni/Magician.atlas' });
                }

                const resources = await Assets.load('magician');

                if (!resources || !resources.spineData) {
                    console.error('Resources or spineData is null');
                    return;
                }

                const magician = new Spine(resources.spineData);

                magician.x = 135;
                magician.y = 150;
                magician.scale.x = 0.5;
                magician.scale.y = 0.5;
                magician.state.setAnimation(0, 'Normal', true);
                magician.state.timeScale = 0.5;
                magician.autoUpdate = true;
                appRef.current.stage.addChild(magician);
                magicianRef.current = magician;
            } catch (error) {
                console.error('Spine 애니메이션 로드 중 오류 발생:', error);
            }
        }

        loadSpineAnimation();

        // 재분배하기 버튼
        const terrainButton = new PIXI.Graphics();
        terrainButton.beginFill(15817563);
        terrainButton.drawRoundedRect(73, 372, 250, 50, 10);
        terrainButton.endFill();
        terrainButton.interactive = true;
        terrainButton.buttonMode = true;

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 'black',
        });

        // 재분배하기 버튼 텍스트
        const buttonText = new PIXI.Text('재분배하기', style);
        buttonText.anchor.set(0.5); 
        buttonText.x = terrainButton.width / 2 + 73; 
        buttonText.y = terrainButton.height / 2 + 372;

        // 컨테이너에 버튼과 텍스트 추가
        uiContainer.addChild(terrainButton);
        uiContainer.addChild(buttonText);
        terrainButton.on('pointerdown', async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await api('/api/v1/user/terrain', 'POST', null, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                setResources((prev) => ({
                    ...prev,
                    gold: response.data.gold,
                    land: response.data.land,
                    sea: response.data.sea,
                    mountain: response.data.mountain,
                }));
                console.log(response);

                magicianRef.current.state.setAnimation(0, 'Terrain', false);
                explodePow(terrainButton.x + terrainButton.width / 2, terrainButton.y - terrainButton.height / 2);
                magicianRef.current.state.addAnimation(0, 'Normal', true, 0);
            } catch (error) {
                console.error('Failed to redistribute:', error);
            }
        });
        Assets.unload('magician');
        Assets.unload('magicianAtlas');

        return () => {
            // 자산 언로드
            Assets.unload('magician');
            Assets.unload('magicianAtlas');

            // 마법사 객체가 존재하면 파괴
            if (magicianRef.current) {
                try {
                    magicianRef.current.destroy();
                    magicianRef.current = null; // 참조 초기화
                } catch (error) {
                    console.error('마법사 객체 파괴 중 오류 발생:', error);
                }
            }
        };
    }, [resources]);

    useEffect(() => {
        const QuantityTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 'black',
        });

        //골드양 텍스트
        const existingGoldText = appRef.current.stage.getChildByName('goldText');
        if (existingGoldText) {
            appRef.current.stage.removeChild(existingGoldText);
        }
        const goldText = new PIXI.Text(`${resources.gold}`, QuantityTextStyle);
        goldText.name = 'goldText';
        goldText.x = 550;
        goldText.y = 75;
        appRef.current.stage.addChild(goldText);

        // 육지 수량 텍스트
        const existingLandText = appRef.current.stage.getChildByName('landQtyText');
        if (existingLandText) {
            appRef.current.stage.removeChild(existingLandText);
        }
        const landQtyText = new PIXI.Text(`${resources.land} 칸`, QuantityTextStyle);
        landQtyText.name = 'landQtyText';
        landQtyText.x = 725;
        landQtyText.y = 193;
        appRef.current.stage.addChild(landQtyText);

        // 바다 수량 텍스트
        const existingSeaText = appRef.current.stage.getChildByName('seaQtyText');
        if (existingSeaText) {
            appRef.current.stage.removeChild(existingSeaText);
        }
        const seaQtyText = new PIXI.Text(`${resources.sea} 칸`, QuantityTextStyle);
        seaQtyText.name = 'seaQtyText';
        seaQtyText.x = 725;
        seaQtyText.y = 303;
        appRef.current.stage.addChild(seaQtyText);

        // 산 수량 텍스트
        const existingMountainText = appRef.current.stage.getChildByName('mountainQtyText');
        if (existingMountainText) {
            appRef.current.stage.removeChild(existingMountainText);
        }
        const mountainQtyText = new PIXI.Text(`${resources.mountain} 칸`, QuantityTextStyle);
        mountainQtyText.name = 'mountainQtyText';
        mountainQtyText.x = 725;
        mountainQtyText.y = 413;
        appRef.current.stage.addChild(mountainQtyText);
    }, [resources]);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default Terrain;
