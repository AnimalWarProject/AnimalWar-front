import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import landTileImagePath from './imgs/LandTile.webp';
import seaTileImagePath from './imgs/SeaTile.webp';
import mountainTileImagePath from './imgs/MountainTile.webp';
import { api } from '../../network/api';

const Place = ({ userUUID }) => {
    const pixiContainer = useRef(null);
    const [activeTab, setActiveTab] = useState(null); // null로 초기화
    const [inventory, setInventory] = useState({ buildings: [], animals: [] });
    const [tileData, setTileData] = useState([]);
    const [textures, setTextures] = useState({});
    const appRef = useRef(null);

    // Function to preload images and create PIXI textures
    const preloadImagesAndCreateTextures = (imagePaths, callback) => {
        let loadedImages = 0;
        const textures = {};
        const keys = Object.keys(imagePaths);

        const onImageLoaded = (key, texture) => {
            textures[key] = texture;
            loadedImages++;
            if (loadedImages === keys.length) {
                callback(textures);
            }
        };

        keys.forEach((key) => {
            const image = new Image();
            image.src = imagePaths[key];
            image.onload = () => onImageLoaded(key, PIXI.Texture.from(image));
        });
    };

    const fetchInventory = async (type) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await api(`/api/v1/inventory/${type}`, 'GET', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setInventory((prev) => ({ ...prev, [type]: response.data }));
            console.log(response);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchTileData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await api('/api/v1/terrain/myTile', 'GET', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setTileData(response.data); // API로부터 받은 타일 데이터를 상태에 저장
        } catch (error) {
            console.error('Error fetching tile data:', error);
        }
    };

    // 이미지를 로드하고 PIXI 텍스처로 변환하는 함수
    const loadTextures = useCallback(async () => {
        const texturePaths = { LAND: landTileImagePath, SEA: seaTileImagePath, MOUNTAIN: mountainTileImagePath };
        const loadedTextures = {};

        for (const [key, path] of Object.entries(texturePaths)) {
            const image = await loadImage(path);
            loadedTextures[key] = PIXI.Texture.from(image);
        }

        setTextures(loadedTextures);
    }, []);

    // 이미지를 로드하는 Promise 기반 함수
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
        });
    };

    // 탭 선택을 처리하는 함수
    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        fetchInventory(tab);
    };

    useEffect(() => {
        fetchInventory('buildings');
        fetchInventory('animals');
    }, []);

    useEffect(() => {
        loadTextures();
        fetchTileData();
    }, [loadTextures, userUUID]);

    useEffect(() => {
        if (Object.keys(textures).length === 3 && tileData.length > 0) {
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
                    appRef.current = app;

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

                    tileData.forEach((data) => {
                        createTile(data, container, textures, tileSize);
                    });

                    container.interactive = true;
                    container.buttonMode = true;
                    container.scale.set(0.5);
                    container.position.set(app.screen.width / 2, app.screen.height / 2);

                    let startPosition = null;

                    // 탭 선택 처리 함수
                    const handleTabSelect = (selectedTab) => {
                        setActiveTab(selectedTab);
                        // 선택된 탭에 따라서 인벤토리 데이터를 가져옴
                        fetchInventory(selectedTab);
                    };

                    // 우측 UI 박스 생성
                    const ListContainer = new Graphics();
                    ListContainer.beginFill(0xffffff, 0.5);
                    ListContainer.drawRoundedRect(0, 70, 400, 500, 20);
                    ListContainer.x = app.screen.width - 300; // 위치 조정
                    ListContainer.y = 0;
                    app.stage.addChild(ListContainer);

                    // 동물 탭 박스 생성
                    const animalTabBox = new Graphics();
                    animalTabBox.beginFill(0xffffff, 0.5);
                    animalTabBox.drawRoundedRect(0, 10, 150, 50, 20);
                    animalTabBox.x = ListContainer.x; // x 위치 설정
                    animalTabBox.y = 10; // y 위치 설정
                    animalTabBox.interactive = true; // 상호작용 가능하게 설정
                    animalTabBox.buttonMode = true; // 버튼 모드 활성화
                    const animalText = new PIXI.Text('동물', { fill: 0xffffff });
                    animalText.x = animalTabBox.x + 5;
                    animalText.y = animalTabBox.y + 5;
                    animalTabBox.addChild(animalText);
                    animalTabBox.on('pointerdown', () => handleTabSelect('animals'));
                    app.stage.addChild(animalTabBox);

                    // 건물 탭 박스 생성
                    const buildingTabBox = new Graphics();
                    buildingTabBox.beginFill(0xffffff, 0.5);
                    buildingTabBox.drawRoundedRect(150, 10, 150, 50, 20);
                    buildingTabBox.x = ListContainer.x; // x 위치 설정
                    buildingTabBox.y = 70; // y 위치 설정
                    buildingTabBox.interactive = true; // 상호작용 가능하게 설정
                    buildingTabBox.buttonMode = true; // 버튼 모드 활성화
                    const buildingText = new PIXI.Text('건물', { fill: 0xffffff });
                    buildingText.x = buildingTabBox.x + 5;
                    buildingText.y = buildingTabBox.y + 5;
                    buildingTabBox.addChild(buildingText);
                    buildingTabBox.on('pointerdown', () => handleTabSelect('buildings'));
                    app.stage.addChild(buildingTabBox);

                    app.stage.addChild(animalTabBox);
                    app.stage.addChild(buildingTabBox);

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
                    return () => {
                        if (app) app.destroy(true, true);
                    };
                }
            );
        }
    }, [textures, tileData]);

    useEffect(() => {
        // 인벤토리 데이터가 변경될 때마다 실행됩니다.
        if (appRef.current && activeTab) {
            // 인벤토리 데이터를 표시하는 로직을 여기에 구현합니다.
            // 예: activeTab === 'animals' 일 때 동물 인벤토리를 표시
            // 예: activeTab === 'buildings' 일 때 건물 인벤토리를 표시
        }
    }, [inventory, activeTab]);

    const createTile = (tileData, container, textures, tileSize) => {
        const texture = textures[tileData.landForm];
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        const isoX = ((tileData.x - tileData.y) * tileSize.width) / 2;
        const isoY = ((tileData.x + tileData.y) * tileSize.height) / 4;
        sprite.x = isoX + container.width / 2;
        sprite.y = isoY;

        // 모든 타일에 동일한 zIndex를 설정하여 같은 레벨에 렌더링되도록 함
        sprite.zIndex = 0; // 이전에는 sprite.zIndex = tileData.y; 였음

        container.addChild(sprite);
    };

    return <div ref={pixiContainer} className="outlet-container"></div>;
};
export default Place;
