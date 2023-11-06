import { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js';


const Exchange = () => {

    const canvasRef = useRef(null);

    useEffect(() => {

        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            width: canvasWidth,
            height: canvasHeight,
        });

        // Use ref to append the PIXI application view to the DOM.
        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }


        // const background = PIXI.Sprite.from(back);
        // background.width = app.screen.width;
        // background.height = app.screen.height;


    }, [])

    return <div ref={canvasRef}></div>;
}

export default Exchange;