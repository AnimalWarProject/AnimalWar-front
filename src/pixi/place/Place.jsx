import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import landTileImagePath from './imgs/LandTile.webp';
import seaTileImagePath from './imgs/SeaTile.webp';
import mountainTileImagePath from './imgs/MountainTile.webp';

const Place = ({ userUUID }) => {
    const pixiContainer = useRef(null);

    // Function to preload images and create PIXI textures
    const preloadImagesAndCreateTextures = (imagePaths, callback) => {
        let loadedImages = 0;
        const textures = {};
        const keys = Object.keys(imagePaths);

        const onImageLoaded = (key, texture) => {
            console.log(`${key} image loaded`); // 로드된 이미지의 로그를 출력합니다.
            textures[key] = texture;
            loadedImages++;
            if (loadedImages === keys.length) {
                console.log('All images loaded.');
                callback(textures);
            }
        };

        keys.forEach((key) => {
            const image = new Image();
            image.src = imagePaths[key];
            image.onload = () => onImageLoaded(key, PIXI.Texture.from(image));
            console.log(`Loading ${key} image...`); // 이미지 로드가 시작됨을 알리는 로그를 출력합니다.
        });
    };

    useEffect(() => {
        preloadImagesAndCreateTextures(
            { LAND: landTileImagePath, SEA: seaTileImagePath, MOUNTAIN: mountainTileImagePath },
            (textures) => {
                const app = new PIXI.Application({
                    width: 960,
                    height: 640,
                    backgroundColor: 0x1099bb,
                    antialias: true,
                });
                pixiContainer.current.appendChild(app.view);

                const container = new PIXI.Container();
                app.stage.addChild(container);
                app.stage.sortableChildren = true;

                const tileSize = {
                    width: textures.LAND.width,
                    height: textures.LAND.height,
                };

                if (tileSize.width === 0 || tileSize.height === 0) {
                    console.error('Tile size is zero. Textures may not have loaded properly.');
                    return;
                }

                const tilesData = generateDummyData();
                tilesData.forEach((tileData) => {
                    createTile(tileData, container, textures, tileSize);
                });

                container.interactive = true;
                container.buttonMode = true;
                container.scale.set(0.5);
                container.position.set(app.screen.width / 2, app.screen.height / 2);

                let startPosition = null;

                container
                    .on('pointerdown', (event) => {
                        startPosition = event.data.getLocalPosition(container.parent);
                        container.alpha = 0.5;
                    })
                    .on('pointerup', () => {
                        startPosition = null;
                        container.alpha = 1;
                    })
                    .on('pointermove', (event) => {
                        if (startPosition) {
                            const newPosition = event.data.getLocalPosition(container.parent);
                            container.x += newPosition.x - startPosition.x;
                            container.y += newPosition.y - startPosition.y;
                            startPosition = newPosition;
                        }
                    });

                // Add zoom functionality
                app.view.addEventListener('wheel', (event) => {
                    event.preventDefault();
                    const direction = event.deltaY > 0 ? -1 : 1;
                    const factor = 0.05;
                    const newScale = container.scale.x + factor * direction;
                    container.scale.set(newScale, newScale);
                });

                console.log(`Container position - x: ${container.x}, y: ${container.y}`);
                console.log(container.getBounds());

                return () => {
                    if (app) app.destroy(true, true);
                };
            }
        );
    }, [userUUID]);

    const createTile = (tileData, container, textures, tileSize) => {
        const texture = textures[tileData.landForm];
        const sprite = new PIXI.Sprite(texture);

        // 45도 기울어진 격자 좌표를 계산합니다.
        const baseX = tileData.x * tileSize.width;
        const baseY = tileData.y * tileSize.height;
        const rotatedX = baseX - baseY;
        const rotatedY = (baseX + baseY) / 2;

        // 스프라이트 위치를 설정합니다.
        sprite.x = rotatedX + container.width / 2; // 컨테이너의 중앙을 기준으로 X 위치를 조정합니다.
        sprite.y = rotatedY; // Y 위치는 수정하지 않습니다.

        // zIndex 설정으로 타일 겹침 순서를 제어합니다.
        sprite.zIndex = tileData.y; // 더 높은 Y 값이 더 위에 오도록 설정합니다.

        container.addChild(sprite);
    };

    const generateDummyData = () => {
        let dummyTiles = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const landForms = ['LAND', 'SEA', 'MOUNTAIN'];
                const randomLandForm = landForms[Math.floor(Math.random() * landForms.length)];
                dummyTiles.push({
                    id: `${row}-${col}`,
                    landForm: randomLandForm,
                    x: col,
                    y: row,
                });
            }
        }
        return dummyTiles;
    };

    return <div ref={pixiContainer} className="place-container" />;
};

export default Place;
