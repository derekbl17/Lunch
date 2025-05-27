const asyncHandler=require('express-async-handler')
const Item=require('../models/itemModel')


const addItem=asyncHandler(async(req,res)=>{
    const {name,description,price,imageUrl}=req.body.itemData

    const item=await Item.create({
        name,
        description,
        price,
        imageUrl
    })
    res.status(200).json(item)
})

const deleteItem=asyncHandler(async(req,res)=>{
    const item=await Item.findById(req.params.id)
    if(!item){
        res.status(400)
        throw new Error('Item not found')
    }

    await Item.findByIdAndDelete(req.params.id)
    res.status(200).json({id:req.params.id})
})

const getItems=asyncHandler(async(req,res)=>{
    const categories=await Item.find()

    if (!categories){
        res.status(400)
        throw new Error('No items')
    }
    res.status(200).json(categories)
})
module.exports={addItem,deleteItem,getItems}