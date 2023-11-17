import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import landTileImagePath from './imgs/LandTile.webp';
import seaTileImagePath from './imgs/SeaTile.webp';
import mountainTileImagePath from './imgs/MountainTile.webp';
import { api } from '../../network/api';

const Place = ({ userUUID }) => {
    const pixiContainer = useRef(null);
    const [activeTab, setActiveTab] = useState('animals');
    const [inventory, setInventory] = useState({ buildings: [], animals: [] });
    const [tileData, setTileData] = useState([]);
    const [textures, setTextures] = useState({});
    const appRef = useRef(null);
    const animalTabBox = useRef(null);
    const buildingTabBox = useRef(null);
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 4;

    const clearInventoryDisplay = () => {
        if (appRef.current) {
            const childrenToRemove = appRef.current.stage.children.filter((child) => child.isInventoryItem);
            childrenToRemove.forEach((child) => appRef.current.stage.removeChild(child));
        }
    };

    const handleTabSelect = useCallback(
        (tab) => {
            clearInventoryDisplay();
            setActiveTab(tab);
            fetchInventory(tab);
            if (animalTabBox.current && buildingTabBox.current) {
                updateTabStyle(tab);
            }
        },
        [animalTabBox, buildingTabBox]
    );

    const updateTabStyle = (selectedTab) => {
        animalTabBox.current.clear();
        animalTabBox.current.beginFill(selectedTab === 'animals' ? 0xffc0cb : 0xffffff, 0.85);
        animalTabBox.current.lineStyle(selectedTab === 'animals' ? 1 : 0, 0x000000);
        animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);

        buildingTabBox.current.clear();
        buildingTabBox.current.beginFill(selectedTab === 'buildings' ? 0xffc0cb : 0xffffff, 0.85);
        buildingTabBox.current.lineStyle(selectedTab === 'buildings' ? 1 : 0, 0x000000);
        buildingTabBox.current.drawRoundedRect(810, 20, 150, 50, 20);
    };

    const fetchInventory = async (type) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await api(`/api/v1/inventory/${type}`, 'GET', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setInventory((prev) => ({ ...prev, [type]: response.data }));
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
            setTileData(response.data);
        } catch (error) {
            console.error('Error fetching tile data:', error);
        }
    };

    const loadTextures = useCallback(async () => {
        const texturePaths = { LAND: landTileImagePath, SEA: seaTileImagePath, MOUNTAIN: mountainTileImagePath };
        const loadedTextures = {};

        for (const [key, path] of Object.entries(texturePaths)) {
            loadedTextures[key] = PIXI.Texture.from(path);
        }

        setTextures(loadedTextures);
    }, []);

    const getObjectImagePath = useCallback(
        (item) => {
            if (activeTab === 'animals') {
                return `/objectImgs/animals/${item.animal.species.toLowerCase()}/${item.animal.imagePath}`;
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

                const ListContainer = new PIXI.Graphics();
                ListContainer.beginFill(0xffffff, 0.8);
                ListContainer.drawRoundedRect(0, 70, 400, 500, 20);
                ListContainer.x = app.screen.width - 300;
                ListContainer.y = 0;
                app.stage.addChild(ListContainer);

                animalTabBox.current = new PIXI.Graphics();
                animalTabBox.current.beginFill(0xffffff, 0.8);
                animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);
                animalTabBox.current.interactive = true;
                animalTabBox.current.buttonMode = true;
                const animalText = new PIXI.Text('동물', { fill: 0x000000, fontSize: 24 });
                animalText.x = 710;
                animalText.y = 35;
                animalTabBox.current.addChild(animalText);
                animalTabBox.current.on('pointerdown', () => handleTabSelect('animals'));
                app.stage.addChild(animalTabBox.current);

                buildingTabBox.current = new PIXI.Graphics();
                buildingTabBox.current.beginFill(0xffffff, 0.8);
                buildingTabBox.current.drawRoundedRect(810, 20, 150, 50, 20);
                buildingTabBox.current.interactive = true;
                buildingTabBox.current.buttonMode = true;
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
        if (appRef.current && activeTab) {
            // 기존 아이템 삭제
            clearInventoryDisplay();

            const handlePrevButtonClick = () => {
                const newStartIndex = Math.max(startIndex - itemsPerPage, 0);
                setStartIndex(newStartIndex);
            };

            const handleNextButtonClick = () => {
                const selectedInventory = inventory[activeTab];
                if (startIndex + itemsPerPage < selectedInventory.length) {
                    const newStartIndex = startIndex + itemsPerPage;
                    setStartIndex(newStartIndex);
                }
            };

            const createPrevButton = () => {
                const button = new PIXI.Graphics();
                button.beginFill(0x000000, 0.5);
                button.drawRoundedRect(700, 465, 50, 30, 5);
                button.interactive = true;
                button.buttonMode = true;
                button.on('pointerdown', handlePrevButtonClick);
                return button;
            };

            const createNextButton = () => {
                const button = new PIXI.Graphics();
                button.beginFill(0x000000, 0.5);
                button.drawRoundedRect(880, 465, 50, 30, 5);
                button.interactive = true;
                button.buttonMode = true;
                button.on('pointerdown', handleNextButtonClick);
                return button;
            };

            // 이전 버튼 확인 및 생성 또는 이벤트 핸들러 갱신
            let prevButton = appRef.current.stage.getChildByName('prevButton');
            if (!prevButton) {
                prevButton = createPrevButton();
                prevButton.name = 'prevButton';
                appRef.current.stage.addChild(prevButton);
            }
            prevButton.off('pointerdown').on('pointerdown', handlePrevButtonClick);

            // 다음 버튼 확인 및 생성 또는 이벤트 핸들러 갱신
            let nextButton = appRef.current.stage.getChildByName('nextButton');
            if (!nextButton) {
                nextButton = createNextButton();
                nextButton.name = 'nextButton';
                appRef.current.stage.addChild(nextButton);
            }
            nextButton.off('pointerdown').on('pointerdown', handleNextButtonClick);

            let initialX = 670;
            let initialY = 90;
            const yOffset = 95;
            const selectedInventory = inventory[activeTab];

            const endIndex = Math.min(startIndex + itemsPerPage, selectedInventory.length);

            for (let index = startIndex; index < endIndex; index++) {
                const item = selectedInventory[index];
                const listBox = new Graphics();
                listBox.isInventoryItem = true;
                listBox.beginFill(0xffffff, 1);
                listBox.drawRoundedRect(initialX, initialY + (index - startIndex) * yOffset, 280, 80, 15);
                listBox.interactive = true;
                listBox.buttonMode = true;

                const objectImagePath = getObjectImagePath(item);
                let nameTextContent, quantityTextContent;
                if (activeTab === 'animals') {
                    nameTextContent = `${item.animal.name} (강화: ${item.upgrade})`;
                    quantityTextContent = `수량: ${item.ownedQuantity}`;
                } else if (activeTab === 'buildings') {
                    nameTextContent = `${item.building.name}`;
                    quantityTextContent = `수량: ${item.ownedQuantity}`;
                }

                const nameText = new PIXI.Text(nameTextContent, {
                    fill: 0x000000,
                    fontSize: 18,
                });
                nameText.x = initialX + 100;
                nameText.y = initialY + (index - startIndex) * yOffset + 15;
                nameText.isInventoryItem = true;

                const quantityText = new PIXI.Text(quantityTextContent, {
                    fill: 0x000000,
                    fontSize: 16,
                });
                quantityText.x = initialX + 100;
                quantityText.y = initialY + (index - startIndex) * yOffset + 45;
                quantityText.isInventoryItem = true;

                const circle = new PIXI.Graphics();
                circle.beginFill(0xffffff);
                circle.lineStyle(1, 0x000000);

                const circleSize = 70;
                circle.drawCircle(initialX + 45, initialY + (index - startIndex) * yOffset + 40, circleSize / 2);
                circle.endFill();

                const objectImage = PIXI.Sprite.from(objectImagePath);
                objectImage.isInventoryItem = true;
                objectImage.anchor.set(0.5);
                objectImage.x = initialX + 45;
                objectImage.y = initialY + (index - startIndex) * yOffset + 40;
                objectImage.scale.set(0.11);

                const imageCircle = new PIXI.Container();
                imageCircle.addChild(circle);
                imageCircle.addChild(objectImage);
                imageCircle.isInventoryItem = true;

                listBox.on('pointerdown', () => {
                    console.log(`Selected item: ${item.building.name}`);
                });

                appRef.current.stage.addChild(listBox);
                appRef.current.stage.addChild(imageCircle);
                appRef.current.stage.addChild(nameText);
                appRef.current.stage.addChild(quantityText);
            }
        }
    }, [inventory, activeTab, getObjectImagePath, startIndex, itemsPerPage]);

    const createTile = (tileData, container, textures, tileSize) => {
        const texture = textures[tileData.landForm];
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        const isoX = ((tileData.x - tileData.y) * tileSize.width) / 2;
        const isoY = ((tileData.x + tileData.y) * tileSize.height) / 4;
        sprite.x = isoX + container.width / 2;
        sprite.y = isoY;
        sprite.zIndex = 0;

        container.addChild(sprite);
    };

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Place;
