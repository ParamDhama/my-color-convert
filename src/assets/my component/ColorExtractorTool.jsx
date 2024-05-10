import React, { useState } from 'react';

const ColorExtractorTool = () => {
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
            };
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const extractColors = (pixelData) => {
        const colorMap = new Map();

        for (let i = 0; i < pixelData.length; i += 4) {
            const [r, g, b] = [pixelData[i], pixelData[i + 1], pixelData[i + 2]];
            const rgbColor = `rgb(${r}, ${g}, ${b})`;

            if (!colorMap.has(rgbColor)) {
                colorMap.set(rgbColor, 1);
            } else {
                colorMap.set(rgbColor, colorMap.get(rgbColor) + 1);
            }
        }

        // Sort colors by frequency
        const sortedColors = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]);

        // Extract top 5 colors (or adjust the limit as needed)
        return sortedColors.slice(0, 5).map(([color]) => color);
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
    );
};

export default ColorExtractorTool;
