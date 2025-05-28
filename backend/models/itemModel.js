const mongoose=require('mongoose')

const itemSchema=mongoose.Schema({
        name:{type:String, required:[true,'item name cant be empty'], unique:[true, 'category already exists!']},
        description:{type:String,required:true},
        price:{type:mongoose.Schema.Types.Decimal128,required:true},
        imageUrl: {type: String,required: true},
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:[]
          }],
    },
    {timestamps:true}
);
itemSchema.query.liked=function(userId){
    return this.where({likes:userId})
  }
  

module.exports=mongoose.model('Item',itemSchema)