const shortid=require("shortid")
const URL=require('../models/url')

async function handleGenerateNewShortURL(req,res){
    
    const body=req.body;
    console.log(body);
    if(!body.url) return res.status(400).json({error: 'please provide the url'})
    const shortID=shortid();
    // console.log(shortID)
    // await URL.create({
    //     shortId:shortID,
    //     redirectURL: body.url,
    //     visitedHistory: [],
    // });

// Create a new URL document
const newURL = new URL({
    shortId: shortID, // Example short ID
    redirectURL: body.url, // Example redirect URL
    visitHistory: [] // Optionally, you can include visit history if needed
});

// Save the new document to the database
newURL.save()
    .then(savedURL => {
        console.log("New URL added:", savedURL);
    })
    .catch(error => {
        console.error("Error adding URL:", error);
    });


console.log('db created')

    return res.json({id:shortID})
}
// console.log("done")

async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    });

}
module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
}