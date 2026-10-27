import express from "express"
import cors from "cors"
import urlRoutes from '../routes/url.routes.js'
import UrlModel from "../models/url.model.js";

const app = express();

app.use(cors())
app.use(express.json());



app.use("/api/url", urlRoutes)

/* 
 @Post //
 */

app.get("/:code", async function (req, res) {

    const { code } = req.params;

    const url = await UrlModel.findOne({
        shortCode: code,
    })

    if(!url) {
        return res.status(404).json({
            error:"URL not found"
        })
    }

    res.redirect(302, url.originalUrl)

    await UrlModel.findOneAndUpdate({
        shortCode: code
    },
{
    $inc: { clicks: 1}
})

})

export default app;
