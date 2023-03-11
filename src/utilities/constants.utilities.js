const constants = {
    MONGO_URL: process.env.MONGO_URL,
    
    DATABASES: {
     USER: "user",
     POSTS: "posts",
     COMMENTS: "comments",
    },
 
    MESSAGES: {
    GET:    "Resource fetched successfully",
    PUT:    "Resource updated successfully",
    DELETE: "Resource deleted successfully",
    POST:   "Resource created successfully",
    ERROR:  "Resource error"
   }
 };
 
 module.exports = constants; 