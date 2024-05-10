import React, { useState } from 'react'
import { FaEyeDropper } from 'react-icons/fa';
import ColorExtractorTool from './ColorExtractorTool';




const Convertor = () => {
    const [rth, setRTH] = useState(1);
    const [bin, setBin] = useState(0);
    const [hex, setHex] = useState('#ffffff');
    const [rgb, setrgb] = useState('255,255,255');
    const [bgHex, setBgHex] = useState("#ffffff");

    const [colors, setColors] = useState([]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixelData = imageData.data;

                const extractedColors = extractColors(pixelData);
                setColors(extractedColors);
                console.log(extractedColors);
            };
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const convertRgbToHex = (r, g, b) => {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const colorDistance = (c1, c2) => {
        const r1 = parseInt(c1.substring(4, 7), 10);
        const g1 = parseInt(c1.substring(9, 12), 10);
        const b1 = parseInt(c1.substring(14, 17), 10);

        const r2 = parseInt(c2.substring(4, 7), 10);
        const g2 = parseInt(c2.substring(9, 12), 10);
        const b2 = parseInt(c2.substring(14, 17), 10);

        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    };

    const extractColors = (pixelData) => {
        const colorMap = new Map();

        for (let i = 0; i < pixelData.length; i += 4) {
            const [r, g, b] = [pixelData[i], pixelData[i + 1], pixelData[i + 2]];
            const rgbColor = `rgb(${r}, ${g}, ${b})`;
            const hexColor = convertRgbToHex(r, g, b);

            if (!colorMap.has(hexColor)) {
                colorMap.set(hexColor, rgbColor);
            }
        }

        // Extract 20 distinct colors
        const extractedColors = Array.from(colorMap.keys());
        const distinctColors = [extractedColors[0]]; // Start with the first color

        for (let i = 1; i < extractedColors.length && distinctColors.length < 20; i++) {
            const color = extractedColors[i];
            let isDistinct = true;

            for (const distinctColor of distinctColors) {
                if (colorDistance(color, distinctColor) < 50) { // Adjust the threshold as needed
                    isDistinct = false;
                    break;
                }
            }

            if (isDistinct) {
                distinctColors.push(color);
            }
        }

        return distinctColors;
    };

    function hexToRgb2(l) {
        let d_hex;
        // Remove the '#' if present
        d_hex = l.replace('#', '');

        // Convert the hexadecimal string to decimal values
        const r = parseInt(d_hex.substring(0, 2), 16);
        const g = parseInt(d_hex.substring(2, 4), 16);
        const b = parseInt(d_hex.substring(4, 6), 16);

        // Return the formatted RGB string
        setrgb(`rgb(${r || "00"},${g || "00"},${b || "00"})`);
        let sum = ((r || 0) + (g || 0) + (b || 0)) / (255 * 3)
        sum > 0.5 ? setBin(1) : setBin(0);
        rth?setBgHex(l):setBgHex(`rgb(${r || "00"},${g || "00"},${b || "00"})`);
    }
    function hexToRgb() {
        let d_hex;
        // Remove the '#' if present
        d_hex = hex.replace('#', '');

        // Convert the hexadecimal string to decimal values
        const r = parseInt(d_hex.substring(0, 2), 16);
        const g = parseInt(d_hex.substring(2, 4), 16);
        const b = parseInt(d_hex.substring(4, 6), 16);

        // Return the formatted RGB string
        setrgb(`rgb(${r || "00"},${g || "00"},${b || "00"})`);
        let sum = ((r || 0) + (g || 0) + (b || 0)) / (255 * 3)
        sum > 0.5 ? setBin(1) : setBin(0);
        setBgHex(`rgb(${r || "00"},${g || "00"},${b || "00"})`)
    }

    function rgbToHex() {
        let d_rgb = rgb;
        let rgb_arr;
        if (d_rgb.includes("rgb") || d_rgb.includes("RGB")) {
            d_rgb = d_rgb.slice(4, -1);
        }

        if (d_rgb.includes(",")) {

            rgb_arr = d_rgb.split(",").map(Number);
        }
        else {

            rgb_arr = d_rgb.split(" ").map(Number);
        }
        let val = "#"
        let sum = 0;
        rgb_arr.forEach((item) => {
            sum += item || 0
            val += (item || 0).toString(16).length == 1 ? "0" + (item || 0).toString(16).toUpperCase() : (item || 0).toString(16).toUpperCase();
        })
        if ((sum / 3) / 255 > 0.5) {
            setBin(1)
        }
        else {
            setBin(0);
        }
        setHex(val)
        setBgHex(val);
    }

    function clipboard() {
        let x = bgHex;
        setBgHex("Copied") 
        navigator.clipboard.writeText(x);
        setTimeout(() => {
            setBgHex(x) ;
            console.log(x);
        }, 500);
    }

    return (
        <div>
            <div className='bg-img h-screen w-screen flex justify-center items-center'>
                <div className='backdrop-blur-lg h-[90%] w-[90%] bg-slate-500/50 shadow-[5px_15px_16px_rgba(0,0,0,0.5),-5px_-15px_20px_rgba(255,255,255,.6)] rounded-lg flex flex-col justify-around items-center'>
                    <div className='absolute h-full w-full text-white' style={{pointerEvents:"none"}}>
                        <div className="flex justify-center items-center h-2/4 text-3xl">
                            <div className='btn-cv h-20 w-20 rounded-full flex items-center justify-center' style={{pointerEvents:"all"}} onClick={() => {
                                const hasSupport = () => ('EyeDropper' in window);
                                if (hasSupport) {
                                    const eyeDropper = new window.EyeDropper();

                                    eyeDropper
                                        .open()
                                        .then((result) => {
                                            const color = result.sRGBHex;
                                            setHex(color);
                                            hexToRgb2(color);

                                        })
                                        .catch(e => {
                                            console.error(e);
                                        });
                                } else {
                                    console.warn('No Support: This browser does not support the EyeDropper API yet!');
                                }

                            }}>
                                <FaEyeDropper />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className={rth ? 'btn-ch-focus' : 'btn-ch'} onClick={() => {setRTH(1)
                            setBgHex(hex);
                        }}>rgb to Hex</button>
                        <button className={rth ? 'btn-ch' : 'btn-ch-focus'} onClick={() => {setRTH(0)
                            setBgHex(rgb);
                        }}>Hex to rgb</button>
                    </div>

                    <div className='flex justify-around items-end w-5/6 h-1/6'>
                        <div className='w-full h-full '>
                            <div className=' w-2/6 h-1/4 flex justify-center items-center text-purple-500 font-semibold text-xl'>
                                {rth ? "RGB Color Code" : "Hex Color Code"}
                            </div>
                            <input type="text" className='input' value={rth ? rgb : hex} onChange={(e) => rth ? setrgb(e.target.value) : setHex(e.target.value)} />
                        </div>
                        <div className='w-full h-full flex flex-col items-end justify-center'>
                            <div className=' w-2/6 h-1/4 flex justify-center items-center text-purple-500 font-semibold text-xl'>
                                {!rth ? "RGB Color Code" : "Hex Color Code"}
                            </div>
                            <input type="text" className='input' value={rth ? hex : rgb} onChange={(e) => rth ? setHex(e.target.value) : setrgb(e.target.value)} />
                        </div>
                        {/* <button type="submit">submit</button> */}
                    </div>

                    <div className='flex justify-center items-center h-20 w-3/6'>
                        <button className='btn-cv' onClick={rth ? rgbToHex : hexToRgb} >convert</button>
                        <button className='btn-cl' onClick={() => {
                            setHex('#FFFFFF')
                            setBgHex('#FFFFFF')
                            setrgb('rgb(255,255,255)')
                            setBin(1)
                        }} >clear</button>
                    </div>
                    <div className='w-72 h-72 bg-slate-200/10 flex justify-center items-center rounded-3xl backdrop-blur-lg'>
                        <button onClick={clipboard}>
                            <div className="w-60 h-60 rounded-3xl flex items-center justify-center text-purple-700 text-3xl shadow-inner" style={{ backgroundColor: bgHex, color: bin == 1 ? "#7e22ce" : "#ffffff", border: bin == 1 ? "1px solid #7e22ce" : " 1px solid#ffffff" }}>
                                {bgHex }

                            </div>
                        </button>
                    </div>

                </div>
            </div>
            <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <div className='flex justify-center '>
                {colors.map((color, index) => (
                    
                    <div
                        key={index}
                        style={{
                            backgroundColor: color,
                            width: '50px',
                            height: '50px',
                            margin: '5px',
                            border: '1px solid #000',
                        }}
                    />
                ))}
            </div>
        </div>
        </div>
    )
}

export default Convertor
