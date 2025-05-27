const mongoose=require('mongoose')

const itemSchema=mongoose.Schema({
        name:{type:String, required:[true,'item name cant be empty'], unique:[true, 'category already exists!']},
        description:{type:String,required:true},
        price:{type:mongoose.Schema.Types.Decimal128,required:true},
        imageUrl: {type: String,required: true},
    },
    {timestamps:true}
);

module.exports=mongoose.model('Item',itemSchema)