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

const toggleLikeItem=asyncHandler(async(req,res)=>{
    const item=await Item.findById(req.params.id)
    if(!item){
        res.status(400)
        throw new Error('Item not found')
    }

    const userId = req.user.userId;
    const likeIndex = item.likes.indexOf(userId);

    // Toggle like
    if (likeIndex === -1) {
    // Add like
        item.likes.push(userId);
        await item.save();
        res.status(200).json({
            message: 'Item liked',
            likes: item.likes,
            isLiked: true
        });
    } else {
    // Remove like
        item.likes.pull(userId);
        await item.save();
        res.status(200).json({
            message: 'Post unliked',
            likes: item.likes,
            isLiked: false
        });
    }
})
const getLikedItems=asyncHandler(async(req,res)=>{
    const items=await Item.find().liked(req.user.userId)
    res.status(200).json(items)
})
module.exports={addItem,deleteItem,getItems, toggleLikeItem,getLikedItems}