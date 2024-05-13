import express from "express";
import {createFarm,getFarms, getFarmById, geWeather, createFarm, createPost, getPost, updateFarm, deleteFarm} 

from "../controllers/farmingTipsController.js"; 
import { protect } from "../middlewares/authMiddleware.js"; //yet to be created
const router = express.Router()


router.post('/', protect, createFarm)
router.get('/', protect, getFarms)
router.get('/', protect, getFarmById)
router.put('/', protect, updateFarm)
router.get('/', protect, geWeather)
router.delete('/', protect, deleteFarm)
router.post('/', protect, createPost)
router.get('/', protect, getPost)
router.put('/', protect, updatePost)


export default router


