class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    /*_________---------Search product -----------_________________*/
    search(){
        const keyword = this.queryStr.keyword 
        // If keyword is access then
        ? {
            name:{
                $regex: this.queryStr.keyword,
                $options:"i", 
            },           
        } : {};
        // console.log(keyword);
    this.query = this.query.find({...keyword});
        return this;
    }  
    filter(){
        const queryCopy = {...this.queryStr}
        // console.log(queryCopy);
        //remove some fileds for category
        const removeFields = ["keyword", "page","limit"];

        removeFields.forEach((key) => delete queryCopy[key]);
        // console.log(queryCopy);


        // Filter for price and reating
        console.log(queryCopy);
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr));
        console.log(queryStr);
        return this;
    } 


    /*__________pagination per page 5____________*/

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }

};

module.exports = ApiFeatures;