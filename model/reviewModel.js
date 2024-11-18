const mongoose= require('mongoose')
const Tour= require("./toursModel")
const {Schema}=mongoose
const reviewSchema = new mongoose.Schema(
    {
      review: {
        type: String,
        required: [true, 'Review can not be empty!']
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Rating can not be empty!']


      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
      }
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

reviewSchema.index({tour:1,user:1},{unique:true})
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: "user",
        select:"name photo"
    })
    next()
})

reviewSchema.statics.calcualteAverageRatings= async function(tourId){
    reviewStat= await this.aggregate([
    {$match:{tour:tourId},},
    {
     $group:{
      _id:"$tour",
      count:{$sum:1},
      averageRating:{$avg:"$rating"}
     } 
    }
  ])
 if(reviewStat.length>0){
  await Tour.findOneAndUpdate(tourId, {
    ratingsAverage: reviewStat[0].averageRating,
    ratingsQuantity: reviewStat[0].count
  });
 }
 else{
  await Tour.findOneAndUpdate(tourId, {
    ratingsAverage: 4.5,
    ratingsQuantity:  0
  })
 }

 // This option returns the updated document
  
 }
// works when a document is created
reviewSchema.post("save", function (){
  this.constructor.calcualteAverageRatings(this.tour)
})

// works before a document is updated or deleted
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // Get the original query object
   const doc = await this.model.findOne(this.getQuery()); // Finds the document based on the  
    // Continue to the next middleware
    this.doc=doc
  next();
});

// works after a document is updated or deleted
reviewSchema.post(/^findOneAnd/,async function(next){
  // get the document id and modle from the prev query middleware
 const {doc} =this
 const {tour:tourId}=doc
  model=doc.constructor
  model.calcualteAverageRatings(tourId)
  })





module.exports= mongoose.model("Review",reviewSchema )