const express= require("express")
const app=express()
const {connectToMongoDB}=require("./connect")
const urlRoute=require("./routes/url")
const PORT=8001;
const URL=require('./models/url')
connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log('Mongodb connected'))

app.use(
    express.urlencoded({ extended: true })
);
app.use(express.json())

app.use("/url",urlRoute)
app.get('/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory:{
                    timestamp: Date.now()
                }
            }
        }
    )
    console.log('entry found',entry);
    res.redirect(entry.redirectURL)
})
app.listen(PORT,()=>console.log(`Server started at ${PORT}`))