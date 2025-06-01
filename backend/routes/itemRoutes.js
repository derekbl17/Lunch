const express = require('express')
const router = express.Router()
const {protect,adminProtect}=require('../middleware/authMiddleware')
const { addItem, deleteItem, getItems, toggleLikeItem, getLikedItems, rateItem, updateItem } = require('../controllers/itemController')

router.post('/',protect,adminProtect,addItem)
router.delete('/:id',protect,adminProtect,deleteItem)
router.get('/',protect,getItems)
router.patch('/like/:id',protect,toggleLikeItem)
router.get('/liked',protect,getLikedItems)
router.patch('/rate/:id',protect,rateItem)
router.patch('/:id',protect,adminProtect,updateItem)

module.exports=router