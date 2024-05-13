// weatherController.js
const axios = require('axios');
import asyncHandler from "express-async-handler";
import farmingTips from '../models/farmingTipsModels'



//getting the API KEY from the weathermapAPI  
const getWeather= asyncHandler(async (req, res)=>{
    try{
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?id=524901&appid=cfe3fdf6a77f1daf45a930dde33a0c03');
        const data= response.data;
        const weather = new weather({
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            currentTime: new Date(data.dt * 1000)
        });
        await weather.save();
        res.send(weather);
    }catch (error){
        res.send(500).send({message: "Internet server error" });
    }
});



// farmController.
//create farm 
const createFarm = asyncHandler(async (req, res)=>{
    try{
        const farm = new Farm(req.body);
        await farm.save();
        res.send(farm);

    }catch (error){
        res.status(500).send({error: " Internet Server Error" });
    }
});



//get all the farms 
const getFarms = asyncHandler (async (req, res) => {
  try {
    const farms = await Farm.find({}).sort('-createdAt');
    res.send(farms);
  } catch (error) {
    res.status(500).send({ error: "Internet server error" });
  }
});



//get a single farm by ID
const getFarm = asyncHandler (async (req, res) => {
  const { id } = req.params;
  try {
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).send({ error: 'Farm not found' });
    }
    res.send(farm);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({ error: 'Farm not found' });
    }
    res.status(500).send({ error: "Internet server error" });
  }
});


// update a farm by an ID
const updateFarm = asyncHandler (async (req, res) => {
  const { id } = req.params;
  try {
    const farm = await Farm.findByIdAndUpdate(id, req.body, { new: true });
    if (!farm) {
      return res.status(404).send({ error: 'Farm not found' });
    }
    res.send(farm);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({ error: 'Farm not found' });
    }
    res.status(500).send({ error: "Internet server error" });
  }
});


//delete a farm by an ID
const deleteFarm =asyncHandler (async (req, res) => {
  const { id } = req.params;
  try {
    const farm = await Farm.findByIdAndDelete(id);
    if (!farm) {
      return res.status(404).send({ error: 'Farm not found' });
    }
    res.send(farm);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({ error: 'Farm not found' });
    }
    res.status(500).send({ error: error.message });
  }
});



// postController.js

//create a post
const createPost = asyncHandler (async (req, res) => {
  const { farmId } = req.params;
  try {
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).send({ error: 'Farm not found' });
    }
    const post = new Post(req.body);
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



//get a post by an ID
const getPost =asyncHandler (async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    res.send(post);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({ error: 'Post not found' });
    }
    res.status(500).send({ error: error.message });
  }
});

 

//update a post by an ID
const updatePost = asyncHandler (async (req, res) => {
  const {id} = req.params;
 try {
   const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
   if (!post) {
     return res.status(404).send({error:"Could not update post"});
   }
 } catch (error) {
   console.error(error);
   res.status(500).send({error: "Internet server error" });
 }
});  

export {
    getWeather,
    getFarms,
    createFarm,
    getFarm,
    updateFarm,
    updatePost,
    deleteFarm,
    createPost,
    getPost,
  };
  



