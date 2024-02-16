const bwipjs = require("bwip-js");
const fs = require("fs");
const axios = require("axios")
const { Binary } = require('bson');
class ImageService {
    imageFileToBuffer(filePath) {
        try {
            const imageBuffer = fs.readFileSync(filePath);
            return imageBuffer;
        } catch (error) {
            console.error(`Error reading the image file: ${error.message}`);
            return null;
        }
    }
    convertUploadToBuffer(file){
        try{
            const buffer = Buffer.from(file.buffer)
            const base64String = buffer.toString('base64');
            return Binary.createFromBase64(base64String, 0);
        }catch(error){
            console.error(`File upload error: ${error.message}`);
            return null;
        }
    }
    genarateToBARCODEBuffer(content, scale, height) {
        bwipjs.toBuffer({
            bcid: 'code128',
            text: content,
            scale: scale,
            height: height,
            includetext: true,
            textxalign: 'center',
        }, function (err, png) {
            if (err) {
                console.error(err);
            } else {
                return png;
            }
        });
    }
    async downloadFormURL(imageUrls) {
        const imageBuffers = [];
        for (const imageUrl of imageUrls) {
            await  axios
                .get(imageUrl, {
                    responseType: 'arraybuffer',
                })
                .then( (response) => {
                    const base64Image =  Buffer.from(response.data, 'binary').toString('base64');
                    imageBuffers.push(base64Image);
                })
                .catch((error) => {
                    console.error('Lỗi trong quá trình tải hình ảnh:', error);

                    // Gọi callback với lỗi
                });
        }
        return imageBuffers;
    }
    saveImageToFile(imageData) {
        const { originalname, buffer } = imageData;
        const uploadFolder = './uploads/';
        if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder);
        }
        const filePath = `${uploadFolder}${originalname}`;
        console.log("path: "+filePath)
        fs.writeFileSync(filePath, buffer);
        console.log(`Image '${originalname}' saved successfully in the 'uploads' folder.`);
      }
}

module.exports = new ImageService();
