const mongoose = require('mongoose')
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Plz Enter the product"],
        trim: true
    },
    description:{
        type:String,
        required:[true, "Plz enter the Description"]
    },
    price:{
        type:Number,
        required: [true,"plz enter product price"],
        maxLength : [8, "Price cannot exceed 8 Characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required: true
        },
        url:{
            type:String,
            required:true
        }
    }
],
user:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true 
},
category:{
    type:String,
    required:[true, "Plz Enter Product category"],

},
stock:{
    type:Number,
    required:[true, "Plz enter the product stoxk"],
    maxLength:[4, "Stock cannot exceed 4 charactors"],
    default:1
},
numOfReviews:{
    type:Number,
    default:0
},
reviews:[
    {
        user:{
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true 
        },
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }
],
createdAt:{
    type:Date,
    default:Date.now 
}
    
});

//Export the model
module.exports = mongoose.model('Product', productSchema);
