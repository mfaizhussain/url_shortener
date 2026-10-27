import express from 'express';
import UrlModel from '../models/url.model.js';
import generateCode from '../utils/generateCode.js'
const router = express.Router()


router.post("/", async (req, res) =>{

    const { url } = req.body;

    if(!url){
        return res.status(400).json({
            error:"pls enter a URL"
        })
    }


    if(url.startsWith("http://") == false && url.startsWith("https://") == false){
        return res.status(400).json({
            error:" ulr"
        })
    }

    if(url.length > 2048){
        return req.status(400).json({
            error:"URL is too long."
        })
    }


    const code = generateCode()

    const newUrl = await UrlModel.create({
        originalUrl: url,
        shortCode: code,
    })


    return res.status(201).json({
        message:" URL shortened successfully",
        data:{
            originalUrl: newUrl.originalUrl,
            shortCode: newUrl.shortCode,
        }
    })
})


router.get("/", async (req, res) =>{
    const urls = await UrlModel.find()

    // console.log(urls);
    

    return res.status(200).json({
        message:"URLs fetched successfully",
        data:{
            urls
        }
    })

})


router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const url = await UrlModel.findOneAndDelete({
        _id: id,
    });

    if (!url) {
        return res.status(404).json({
            error: "URL not found",
        });
    }

    return res.status(200).json({
        message: "URL deleted successfully",
        data: {
            id: url._id,
        },
    });
});

export default router;
