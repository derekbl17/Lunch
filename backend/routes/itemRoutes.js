const express = require('express')
const router = express.Router()
const {protect,adminProtect}=require('../middleware/authMiddleware')
const { addItem, deleteItem, getItems } = require('../controllers/itemController')

router.post('/',protect,adminProtect,addItem)
router.delete('/:id',protect,adminProtect,deleteItem)
router.get('/',getItems)

module.exports=router