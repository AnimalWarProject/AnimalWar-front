import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import landTileImagePath from './imgs/LandTile.webp';
import seaTileImagePath from './imgs/SeaTile.webp';
import mountainTileImagePath from './imgs/MountainTile.webp';
import { api } from '../../network/api';

const Place = ({ userUUID }) => {
    const pixiContainer = useRef(null);
    const [activeTab, setActiveTab] = useState('animals'); // 'animals'로 초기화
    const [inventory, setInventory] = useState({ buildings: [], animals: [] });
    const [tileData, setTileData] = useState([]);
    const [textures, setTextures] = useState({});
    const appRef = useRef(null);
    const animalTabBox = useRef(null);
    const buildingTabBox = useRef(null);

    const clearInventoryDisplay = () => {
        if (appRef.current) {
            const childrenToRemove = appRef.current.stage.children.filter((child) => child.isInventoryItem);
            childrenToRemove.forEach((child) => appRef.current.stage.removeChild(child));
        }
    };

    // 탭 선택 처리 함수
    const handleTabSelect = useCallback(
        (tab) => {
            clearInventoryDisplay(); // 탭 전환 시 인벤토리 표시 내용 제거
            setActiveTab(tab);
            fetchInventory(tab);
            if (animalTabBox.current && buildingTabBox.current) {
                updateTabStyle(tab);
            }
        },
        [animalTabBox, buildingTabBox]
    );

    const updateTabStyle = (selectedTab) => {
        // 동물 탭 스타일 업데이트
        animalTabBox.current.clear();
        animalTabBox.current.beginFill(selectedTab === 'animals' ? 0xffc0cb : 0xffffff, 0.85);
        animalTabBox.current.lineStyle(selectedTab === 'animals' ? 1 : 0, 0x000000); // 선택된 탭에 테두리 추가
        animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);

        // 건물 탭 스타일 업데이트
        buildingTabBox.current.clear();
        buildingTabBox.current.beginFill(selectedTab === 'buildings' ? 0xffc0cb : 0xffffff, 0.85);
        buildingTabBox.current.lineStyle(selectedTab === 'buildings' ? 1 : 0, 0x000000); // 선택된 탭에 테두리 추가
        buildingTabBox.current.drawRoundedRect(810, 20, 150, 50, 20);
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
            loadedTextures[key] = PIXI.Texture.from(path); // 이미지 경로를 직접 사용
        }

        setTextures(loadedTextures);
    }, []);

    const getObjectImagePath = useCallback(
        (item) => {
            if (activeTab === 'animals') {
                return `/objectImgs/animals/${item.animal.imagePath}`;
            } else if (activeTab === 'buildings') {
                return `/objectImgs/buildings/${item.building.imagePath}`;
            }
            return '';
        },
        [activeTab]
    );

    useEffect(() => {
        fetchInventory('animals');
        loadTextures();
        fetchTileData();
    }, [loadTextures]);

    useEffect(() => {
        if (Object.keys(textures).length === 3 && tileData.length > 0) {
            if (!appRef.current) {
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

                // 우측 UI 박스 생성
                const ListContainer = new PIXI.Graphics(); // 수정된 부분
                ListContainer.beginFill(0xffffff, 0.8);
                ListContainer.drawRoundedRect(0, 70, 400, 500, 20);
                ListContainer.x = app.screen.width - 300; // 위치 조정
                ListContainer.y = 0;
                app.stage.addChild(ListContainer);

                // 동물 탭 박스 생성
                animalTabBox.current = new PIXI.Graphics(); // 수정된 부분
                animalTabBox.current.beginFill(0xffffff, 0.8);
                animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);
                animalTabBox.current.interactive = true; // 상호작용 가능하게 설정
                animalTabBox.current.buttonMode = true; // 버튼 모드 활성화
                const animalText = new PIXI.Text('동물', { fill: 0x000000, fontSize: 24 });
                animalText.x = 710;
                animalText.y = 35;
                animalTabBox.current.addChild(animalText);
                animalTabBox.current.on('pointerdown', () => handleTabSelect('animals'));
                app.stage.addChild(animalTabBox.current);

                // 건물 탭 박스 생성
                buildingTabBox.current = new PIXI.Graphics(); // 수정된 부분
                buildingTabBox.current.beginFill(0xffffff, 0.8);
                buildingTabBox.current.drawRoundedRect(810, 20, 150, 50, 20);
                buildingTabBox.current.interactive = true; // 상호작용 가능하게 설정
                buildingTabBox.current.buttonMode = true; // 버튼 모드 활성화
                const buildingText = new PIXI.Text('건물', { fill: 0x000000, fontSize: 24 });
                buildingText.x = 860;
                buildingText.y = 35;
                buildingTabBox.current.addChild(buildingText);
                buildingTabBox.current.on('pointerdown', () => handleTabSelect('buildings'));
                app.stage.addChild(buildingTabBox.current);

                updateTabStyle(activeTab);

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
            }
        }
    }, [textures, tileData, activeTab, handleTabSelect]);

    useEffect(() => {
        // 인벤토리 데이터가 변경될 때마다 실행됩니다.
        if (appRef.current && activeTab) {
            // 인벤토리 데이터를 표시하는 로직을 여기에 구현합니다.
            // 예: activeTab === 'animals' 일 때 동물 인벤토리를 표시
            // 예: activeTab === 'buildings' 일 때 건물 인벤토리를 표시

            // ListBox를 생성하기 위한 초기 위치 및 간격 설정
            let initialX = 670;
            let initialY = 90;
            const yOffset = 95;

            // 선택된 탭에 따라 표시할 데이터 배열 선택
            const selectedInventory = inventory[activeTab];

            // 데이터를 순회하며 ListBox 생성 및 표시
            selectedInventory.forEach((item, index) => {
                const listBox = new Graphics();
                listBox.isInventoryItem = true;
                listBox.beginFill(0xffffff, 1);
                // listBox.lineStyle(1, 0x000000); // 검은색 테두리
                listBox.drawRoundedRect(initialX, initialY + index * yOffset, 280, 80, 15);
                listBox.interactive = true;
                listBox.buttonMode = true;

                const objectImagePath = getObjectImagePath(item);
                let nameTextContent, quantityTextContent;
                if (activeTab === 'animals') {
                    nameTextContent = `${item.animal.name} (강화: ${item.animal.upgrade})`;
                    quantityTextContent = `수량: ${item.animal.ownedQuantity}`;
                } else if (activeTab === 'buildings') {
                    nameTextContent = `${item.building.name}`;
                    quantityTextContent = `수량: ${item.ownedQuantity}`;
                }

                // 이름 텍스트 설정
                const nameText = new PIXI.Text(nameTextContent, {
                    fill: 0x000000,
                    fontSize: 18,
                });
                nameText.x = initialX + 100;
                nameText.y = initialY + index * yOffset + 15;
                nameText.isInventoryItem = true;

                // 보유 수량 텍스트 설정 (글씨 크기 작게)
                const quantityText = new PIXI.Text(quantityTextContent, {
                    fill: 0x000000,
                    fontSize: 16, // 보유 수량 글씨 크기 작게 설정
                });
                quantityText.x = initialX + 100;
                quantityText.y = initialY + index * yOffset + 45; // 세로 간격 조절
                quantityText.isInventoryItem = true;

                // 흰색 동그라미 생성
                const circle = new PIXI.Graphics();
                circle.beginFill(0xffffff); // 흰색 채우기
                circle.lineStyle(1, 0x000000); // 검은색 테두리
                const circleSize = 70; // 동그라미 크기 설정
                circle.drawCircle(initialX + 45, initialY + index * yOffset + 40, circleSize / 2);
                circle.endFill();

                // 이미지를 PIXI.Sprite에 추가
                const objectImage = PIXI.Sprite.from(objectImagePath);
                objectImage.isInventoryItem = true;
                objectImage.anchor.set(0.5);
                objectImage.x = initialX + 45; // 이미지의 x 위치 조정
                objectImage.y = initialY + index * yOffset + 40; // 이미지의 y 위치 조정
                objectImage.scale.set(0.11); // 이미지 크기 조정

                const imageCircle = new PIXI.Container();
                imageCircle.addChild(circle);
                imageCircle.addChild(objectImage);
                imageCircle.isInventoryItem = true; // 인벤토리 아이템 플래그

                listBox.on('pointerdown', () => {
                    // ListBox를 클릭했을 때 실행할 동작 추가
                    // 예: ListBox 클릭 시 해당 아이템의 상세 정보를 표시
                    console.log(`Selected item: ${item.building.name}`);
                });

                // ListBox를 스테이지에 추가
                appRef.current.stage.addChild(listBox);
                appRef.current.stage.addChild(imageCircle);
                appRef.current.stage.addChild(nameText);
                appRef.current.stage.addChild(quantityText);
            });
        }
    }, [inventory, activeTab, getObjectImagePath]);

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
