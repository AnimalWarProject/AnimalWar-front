import {useEffect, useRef, useState} from 'react';
import * as PIXI from 'pixi.js';
import back from '../imgs/AnyConv.com__Rectangle 12299.webp';
import randomEgg from '../imgs/AnyConv.com__RANDOMEGG 2.webp';
import randomBuilding from '../imgs/AnyConv.com__RandomBuilding.webp';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import {api} from "../../../network/api";

const DrawLoading = () => {
    const canvasRef = useRef(null);
    const nav = useNavigate();
    const location = useLocation();
    const drawData = location.state;
    const qty = drawData.qty;
    const type = drawData.type;
    const [profile, setProfile] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const { data: response } = await api(`/api/v1/user`, 'GET', null, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                    setProfile(response.uuid);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };
        fetchUserData();
        if (profile !== null) {
            const drawRequest = {
                count: qty,
                userUUID: profile
            };

            const canvasWidth = 960;
            const canvasHeight = 640;
            const app = new PIXI.Application({
                background: '#1099bb',
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
            if (type ==='animal'){
                randomEggSprite.on('pointertap', async () => {// todo : api 교체

                    const fetchUserDraw = async () => {
                        try {
                            const { data: response } = await api(`/api/v1/user/draw`, 'POST', drawRequest, {
                                headers: { Authorization: `Bearer ${accessToken}` },
                            });
                        } catch (error) {
                            console.error('Failed to fetch user profile:', error);
                        }
                    };
                    fetchUserDraw();
                    const fetchDrawAnimal = async () => {
                        try {
                            const { data: response } = await api(`/api/v1/draw/animal`, 'POST', drawRequest, {
                                headers: { Authorization: `Bearer ${accessToken}` },
                            });
                            nav('/draw/result', {state: response});
                        } catch (error) {
                            console.error("데이터 가져오기 실패: ", error);
                        }
                    };
                    fetchDrawAnimal();
                });
            }else {
                randomEggSprite.on('pointertap', async () => {// todo : api 교체

                    const fetchUserDraw = async () => {
                        try {
                            const { data: response } = await api(`/api/v1/user/draw`, 'POST', drawRequest, {
                                headers: { Authorization: `Bearer ${accessToken}` },
                            });
                        } catch (error) {
                            console.error('Failed to fetch user profile:', error);
                        }
                    };
                    fetchUserDraw();

                    const fetchDrawBuilding = async () => {
                        try {
                            const { data: response } = await api(`/api/v1/draw/building`, 'POST', drawRequest, {
                                headers: { Authorization: `Bearer ${accessToken}` },
                            });
                            nav('/draw/result', {state: response});
                        } catch (error) {
                            console.error("데이터 가져오기 실패: ", error);
                        }
                    };
                    fetchDrawBuilding();
                });
            }

            if (type === 'animal') {
                randomEggSprite.texture = PIXI.Texture.from(randomEgg);
            } else {
                randomEggSprite.texture = PIXI.Texture.from(randomBuilding);
            }

            profileBox.addChild(randomEggSprite);

            let rotationSpeed = 0.01; // 회전 속도
            let direction = 1; // 1은 우측, -1은 좌측

            app.ticker.add(() => {
                randomEggSprite.rotation += rotationSpeed * direction;

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
            return () => {
                app.destroy();
            };
        }
    }, [profile]); // , qty, nav 제거

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default DrawLoading;
