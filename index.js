const express= require("express")
const app=express()
const path=require('path')
const {connectToMongoDB}=require("./connect")
const urlRoute=require("./routes/url")
const PORT=8001;
const staticRoute=require('./routes/StaticRouter')
const URL=require('./models/url')
connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log('Mongodb connected'))

app.use(
    express.urlencoded({ extended: true })
);

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use("/",staticRoute)
app.use("/url",urlRoute)
// app.get('/:shortId',async(req,res)=>{
//     const shortId=req.params.shortId;
//     const entry=await URL.findOneAndUpdate(
//         {
//             shortId,
//         },
//         {
//             $push:{
//                 visitHistory:{
//                     timestamp: Date.now()
//                 }
//             }
//         }
//     )
//      console.log('entry found',entry);
//       res.redirect(entry.redirectURL)
// })

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() }
                }
            }
        );
        if (!entry) {
            // If entry is null, handle this case accordingly
            return res.status(404).send("URL not found");
        }
        console.log('entry found', entry);
        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT,()=>console.log(`Server started at ${PORT}`))