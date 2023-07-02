class apifeatures {
  constructor(query, querystring) {
    this.query = query;
    this.querystring = querystring;
  }
  filter() {
    // ******FILTERING*********
    // {...req.query} this create a copy of object so that original object remain unaffected to the changes
    // Here we are performing filtering i.e all the field name present in excludedfield if they are not found as value of query then only those field name will be considered whose value is present and then if we pass these valid to as query output will be shown
    const queryobject = { ...this.querystring };
    const excludedfield = ['page', 'sort', 'limit', 'fields'];
    excludedfield.forEach((el) => delete queryobject[el]);
    // console.log(req.query, queryobject);

    // **********ADVANCED FILTERING************
    let querystring2 = JSON.stringify(queryobject);
    querystring2 = querystring2.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log(JSON.parse(querystring));
    this.query.find(JSON.parse(querystring2));
    return this;
  }

  sort() {
    // **********SORTING*********
    if (this.querystring.sort) {
      const sortby = this.querystring.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limiting() {
    // **********FIELD LIMITATION***********
    if (this.querystring.fields) {
      const fields = this.querystring.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    // **********PAGINATION************
    const pagenumber = this.querystring.page * 1 || 1;
    const pageresults = this.querystring.limit * 1 || 100;
    const skippages = (pagenumber - 1) * pageresults;
    this.query = this.query.skip(skippages).limit(pageresults);
    return this;
  }
}

module.exports = apifeatures;
