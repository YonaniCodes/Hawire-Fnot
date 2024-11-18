
class APIFeatures{
    constructor(query,queryString){
    this.query=query
    this.queryString=queryString
    }

    filter(){

        let queryObj={...this.queryString}
        console.log(queryObj)
        const exludedParams=["page","sort","fields","limit"]
        exludedParams.forEach(param=> delete queryObj[param])
    
        let   queryStr= JSON.stringify(queryObj)
        queryStr=queryStr.
        replace(/\b(lt|lte|gt|gte)\b/g,match=> `$${match}` )
        this.query .find(JSON.parse(queryStr))
        return this  

    }
    sort(){ 

        if(this.queryString.sort){
            let sortBy=queryString.sort
            sortBy=sortBy.split(",").join(" ")
            this.query =this.query.sort(sortBy)
        }
       else
         this.query=  this.query.sort('-createdAt')
       return this   

    }

    project(){

    if(this.queryString.fields){
        let {fields} = this.queryString
        fields=fields.split(",").join(" ")
        this.query= this.query.select(fields)
    } 

    else
    this.query= this.query.select("-__v")

    return this

    }

    paginate(){

        let page=this.queryString.page*1 || 1
        let   limit=this.queryString.limit*1||100
        const skip=(page-1)*limit

        this.query= this.query.skip(skip).limit(limit)      
        return this    

    }
}

module.exports=APIFeatures