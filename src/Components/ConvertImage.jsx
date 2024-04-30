import React, { useState } from 'react';

function ImageConverter() {
    const [originalImage, setOriginalImage] = useState(null);
    const [webpImage, setWebpImage] = useState(null);
    const [imageType, setImageType] = useState(null);
    const [conversionProgress, setConversionProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const [fileName, setFileName] = useState('');
    const [webpFileName, setWebpFileName] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const imageDataUrl = event.target.result;
            setOriginalImage(imageDataUrl);
        };

        if (file) {
            reader.readAsDataURL(file);
            const fileType = file.type;
            setImageType(fileType);

            // Obtener y establecer el nombre del archivo
            const fileName = file.name;
            setFileName(fileName);
        }
    };

    const convertToWebP = () => {
        if (originalImage && imageType) {
            setShowProgress(true); // Muestra la barra de progreso al iniciar la conversión
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const webpDataUrl = canvas.toDataURL('image/webp');
                setWebpImage(webpDataUrl);
                setConversionProgress(100);
                setShowProgress(false); // Oculta la barra de progreso al finalizar la conversión
            };

            img.src = originalImage;

            // Simula el progreso de la conversión
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress <= 100) {
                    setConversionProgress(progress);
                } else {
                    clearInterval(interval);
                }
            }, 1000);

            // Establecer el nombre del archivo WebP
            const webpBaseName = fileName.split('.').slice(0, -1).join('.'); // Elimina la extensión original
            const webpFileName = `${webpBaseName}.webp`;
            setWebpFileName(webpFileName);
        }
    };

    const downloadWebPImage = () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = webpImage;
        downloadLink.download = webpFileName; // Utiliza el nombre completo del archivo WebP
        downloadLink.click();
    };


    return (
        <section className='Image-Converter__Content'>
            <div className='ICC-Container'>
                <select onChange={(e) => setImageType(e.target.value)}>
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/jpg">JPG</option>
                </select>


                <section className='Action-File'>
                <input type="file" onChange={handleImageChange} accept={imageType} />
                <div className='Buttons'>
                <button className='Convert' onClick={convertToWebP}>Convertir a WebP</button>
                <button className='Download' onClick={downloadWebPImage} disabled={!webpImage}>
                    Descargar WebP
                </button>
                </div>
                </section>
                <br />
                <div className={`progress-container ${showProgress ? 'show' : ''}`}>
                    <progress value={conversionProgress} max="100">
                        {conversionProgress}%
                    </progress>
                </div>

                <section className='Cards-Images'>
                    <div className='CI__Container'>
                        <div className={`Card ${originalImage ? 'visible' : ''}`}>
                            <div>
                                <h2>{fileName}</h2>
                                <span>Original</span>
                            </div>
                            {originalImage && <img src={originalImage} alt="Original" width="300" />}
                        </div>

                        <div className={`Card ${webpImage ? 'visible' : ''}`}>
                            <div>
                                <h2>{webpFileName}</h2>
                                <span>Converted WebP</span>
                            </div>
                            {webpImage && <img src={webpImage} alt="WebP" width="300" />}
                        </div>

                    </div>
                </section>
            </div>
        </section>
    );
}

export default ImageConverter;
