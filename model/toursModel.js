const mongoose = require("mongoose");
const {Schema} = mongoose;
const slugify= require("slugify")

const tourSchema = new Schema({
    name: {
        type: String,
        required: [true,"Tour Must have A Name"],
        unique: true
     },
    secretTour:{
        type: Boolean,
        default: false

    },
    slug: String,
    price: {
        type: Number,
        required: [true,"Tour Must have  A Price"],
    },
    priceDiscount:{
        type: Number,
        validate: {
            // onnly validates when creating a document
            validator:function( val){
            return val<this.price
            },
            message:"Discount must not exceddd normal price"
       }
    },
    duration:{
        type: Number,
        required: [true,"Tour Must have A Durations"],

    },
    maxGroupSize:{
        type: Number,
        required: [true,"Tour Must have A Group Size"],

    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
      },
    ratingsQuantity:{
        type: Number,
        default: 0,
        min:[0,"A tour must have a minimum of 0 rating count"],
      },
     difficulty:{
        type:String,
        required: true,
        enum:{
             values:['easy','difficult','medium'],
             message:" A tour should be either easy, medium or difficult"
        }
     },
    summary:{
        type: String,
        trim: true
    },
    description:{
        type: String,
        trim: true 
    },
    coverImage:{
        type: String,
        trim: true
    },
    images:{
        type:[String]
    },
    startDates:{
        type:[Date]
    }
    ,
    // Geo Spatial Embedding
    startLocation:{
      type:{
            type:String,
            default:"Point",
            enum:["Point"]
        },
      coordinates:[Number],
      address:String,
      description: String

    },
    locations:[ 
               { 
                type:{
                    type:String,
                    default:"Point",
                    enum:["Point"],
                },
              coordinates:{
                type:[Number],
                index:"2dsphere",
                required:true

              },
              address:String,
              description: String,
              day:Number   
               }
              ],

    guides:[{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    }],

}, { 
    timestamps: true ,    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
   });



// tourSchema.index({price:1})
tourSchema.index({price:1,ratingsAverage:-1})
tourSchema.index({startLocation:"2dsphere"})
 


tourSchema.virtual("DurationWeeks").get(function (){
    return this.duration/7
})


tourSchema.pre("save",function (){
    this.slug= slugify(this.name, { lower: true });
})

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});
  
// QUERY MIDDLEWARE


tourSchema.pre(/^find/,function(next){
   this.populate(
    {
        path:"guides",
        select:"name photo role"
    })
     next()
})
tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne: true}})
     this.start= Date.now()
     next()
})
tourSchema.post(/^find/,function(doc,next){

    console.log(Date.now()-this.start + " miliseconds")
    next()
})


    

module.exports = mongoose.model('Tour', tourSchema);