const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const app = express();
const db = require('./query')


const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./uploads");
     },
     filename: function(req, file, callback) {
         callback(null, file.originalname);
     }
 });
 var upload = multer({
     storage: Storage
 }).array("photo", 3); 

 app.get('/users', db.getUsers)
app.post('/login', db.login)
app.post('/users', db.createUser)
app.post('/userToken', db.getUserByToken)
app.post('/editor', db.getEdiors)
app.get('/story', db.getStory)
app.post('/storyId', db.getStoryById)
app.post('/story', db.createStory)
app.post('/updateStoryStatus', db.updateStoryStatus)
app.post('/updateStory', db.updateStory)
app.post('/delete', db.deleteStory)
 

// mongoose.connect("mongodb+srv://admin-ankur:test123@cluster0-8xn6c.mongodb.net/crud", {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useFindAndModify: false
// });

// const userSchema = {
//     firstname: String,
//     lastname: String,
//     email: String,
//     gender: String,
//     image: String,
//     country: String,
//     address:String,
//     birthday: String
// };
// const User = mongoose.model("user", userSchema);

// app.route("/api/user")
//     .get(function (req, res) {
//         User.find({}, function (err, foundData) {
//             if (!err) {
//                 res.send(foundData);
//             } else {
//                 res.send(err);
//             }
//         });
//     })
//     .post(function (req, res) {
//         const u = new User({
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             email: req.body.email,
//             gender: req.body.gender,
//             image: req.body.image,
//             country: req.body.country,
//             address: req.body.address,
//             birthday: req.body.birthday
//         });

//         u.save(function (err) {
//             if (!err) {
//                 res.send("Sucessfully added a new user");
//             } else {
//                 res.send(err);
//             }
//         });


//     });

    
//     app.post("/delete",function (req, res) {
//         User.deleteOne({"_id":req.body.id}, function(err, obj) {
//         if (err) throw err;
//         res.send("1 document deleted");
//       });
//     });

//     app.post("/update",function (req, res) {
//             var myquery = { _id: req.body.id };
//             var newvalues = { $set: { firstname: req.body.firstname,
//                 lastname: req.body.lastname,
//                 email: req.body.email,
//                 gender: req.body.gender,
//                 image: req.body.image,
//                 country: req.body.country,
//                 address: req.body.address,
//                 birthday: req.body.birthday}};
//             User.updateOne(myquery, newvalues, function(err, obj) {
//               if (err) console.log(err);
//               res.send("1 document updated");
              
//             });

//           });

    

    app.route("/uploads/:id")
    .get(function (req, res) {
       res.sendFile(__dirname+"/uploads/"+req.params.id)
    });


 
 app.post("/upload", function(req, res) {
     upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         return res.end("File uploaded sucessfully!.");
     });
 });

 if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
  
    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }

app.listen(port, () => console.log(`Listening on port ${port}`));