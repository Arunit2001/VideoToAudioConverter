const express    = require('express');
const ffmpeg     = require('fluent-ffmpeg');
const fileUpload = require('express-fileupload');
const app        = express();

app.set("view engine", "ejs");

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/"
}))

ffmpeg.setFfmpegPath('./node_modules/ffmpeg-binaries/bin/ffmpeg.exe'); 

app.get('/', (req, res)=>{
    res.render("home");
})

app.post("/", (req, res)=>{
    // res.contentType('video/mp3');
    // res.attachment('output.mp3');
    res.setHeader('Content-disposition', 'attachment; filename=' + req.files.from.name + '.mp3');
    res.setHeader('Content-type', 'audio/mpeg');

    req.files.from.mv("tmp/"+ req.files.from.name, function(err){
        if(err) return res.sendStatus(500).send(err);
        console.log("file upload successfully");
    })
    
    ffmpeg('tmp/'+ req.files.from.name)
        .toFormat('mp3')
        .pipe(res, {end: true})
        .on('end', function(){
            console.log('done');
        })
        .on('error', function(error){
            console.log("an error ocurred "+ error.message);
        })
})
    
    // fs.createReadStream('tmp/'+ req.files.from.name)
    // .pipe(cloudconvert.convert({
    //     "inputformat": "mp4",
    //     "outputformat": "mp3",
    // }))
    // .on('end', function(){
    //     console.log('done');
    // })
    // .on('error', function(error){
    //     console.log("an error ocurred"+ error.message);
    // })
            
    // // .pipe(res, {end: true})
    // .pipe(res, fs.createWriteStream('C:\Users\PRAGYA\Downloads'))
    // .on('finish', function(){
    //     console.log("done");
    // })

    

    // if(!error){
    //     res.redirect("/");
    // }
// })
/**
 *    input - string, path of input file
 *    output - string, path of output file
 *    callback - function, node-style callback fn (error, result)        
 */

// function convert(input, output, callback) {
//     ffmpeg(input)
//         .toFormat('mp3')
//         .on('end', function() {                    
//             console.log('conversion ended');
//             callback(null);
//         }).on('error', function(err){
//             console.log('error: ', e.code, e.msg);
//             callback(err);
//         }).pipe(res, {end: true});
// }

app.listen(process.env.PORT||5000, ()=>{
    console.log("Server started..");
})