const cloudinary = require('cloudinary').v2;

require('dotenv').config();


cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUDINARY_NAME
});

const uploads = async (file,folder)=>{
     const uploadedImage =  await cloudinary.uploader.upload(file,{
            upload_preset: folder,
            width: 190,
            height: 190,
            crop: "fill",
    })

    return uploadedImage;
}

module.exports = uploads