const express = require('express')
const router = express.Router()
const {protect,adminProtect}=require('../middleware/authMiddleware')
const { addItem, deleteItem, getItems, toggleLikeItem, getLikedItems } = require('../controllers/itemController')

router.post('/',protect,adminProtect,addItem)
router.delete('/:id',protect,adminProtect,deleteItem)
router.get('/',getItems)
router.patch('/like/:id',protect,toggleLikeItem)
router.get('/liked',protect,getLikedItems)

module.exports=router