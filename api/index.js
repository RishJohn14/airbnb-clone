const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const imageDownloader = require('image-downloader');
const fs = require('fs');
const multer = require('multer');

require('dotenv').config();
const User = require('./models/User');
const jwtSecret = 'randomString';
const app = express(); 
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req,res) => {
    res.json('test ok');
})



app.post('/register', async (req,res)=>{
    const {name, email,password} = req.body;
    try
    {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }
    catch(e){
        res.status(422).json(e);
    }
})

app.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOK = bcrypt.compareSync(password, userDoc.password);
        if(passOK)
        {
            jwt.sign({email: userDoc.email,
                 id: userDoc._id,
                 name: userDoc.name},jwtSecret,{},(err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json(userDoc);
            });
        }
        else
        res.status(422).json('Password Not OK');
    }
    else{
        res.status(422).json('User doesnt exist');
    }
})

app.get('/profile', (req,res)=>{
    const {token} = req.cookies;
    if(token)
    {
        jwt.verify(token, jwtSecret, {}, (err,user)=>{
            if(err) throw err;
            //const userDoc = await User.findById(user.id);
            res.json(user);
        });
    }
    else
    res.json(null);
    res.json({token});
})

app.post('/logout', (req,res)=> {
    res.cookie('token','').json(true);
});

app.post('/upload-by-link', async  (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname+'/uploads/' + newName,

    })
    res.json(newName);
})
const photosMiddleWare = multer({dest:'uploads/'});

app.post('/upload', photosMiddleWare.array('photos',100), (req,res)=> {
    const uploadedFiles=[];

    for(let i=0;i<req.files.length;i++)
    {
        const {path,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath  = path +'.'+ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace('uploads/',''));
    }
    res.json(uploadedFiles);
})

app.listen(4000);
