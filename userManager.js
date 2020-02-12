const express = require('express');
const app = express();
const path = require('path')
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const ObjectId = require('mongodb').ObjectID

const port = process.env.PORT || 8080;
let myobj;
let sortTypeFirst = "Sort";
let sortTypeLast = "Sort";

MongoClient.connect(url, {useUnifiedTopology: true}, (err, db) => {
  if (err) throw err;
  let dbo = db.db("userdb");

  app.use(express.json());
  app.use(express.urlencoded({extended: false}));

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');


  app.get('/', (req, res) => {
    res.render('index')
  })

  app.post('/user', (req, res) => {
    console.log(req.body)
    if (req.body.button === 'edit') {
      let editValues = {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          age: req.body.age,
        }
      }
      dbo.collection("users").updateOne({"_id": new ObjectId(req.body._id)}, editValues, function (err, result) {
        if (err) throw err;
        console.log("1 document updated");
      })
    } else if (req.body.button === 'delete') {
      dbo.collection("users").deleteOne({"_id": new ObjectId(req.body._id)}, function (err, result) {
        if (err) throw err;
      });

    } else if (req.body.button === 'search') {
      if (req.body.searchBar === '') {
        dbo.collection("users").find().toArray(function (err, result) {
          let data = []
          if (err) throw err;
          result.forEach(dataSet => {
            data.push(dataSet)
          })
          res.render('userListing', {
            dataSet: data,
            sortFirst: sortTypeFirst,
            sortLast: sortTypeLast
          })
        })
      } else {
        dbo.collection("users").find({$or: [{firstName: req.body.searchBar}, {lastName: req.body.searchBar}]}).toArray(function (err, result) {
          let data = []
          if (err) throw err;
          result.forEach(dataSet => {
            data.push(dataSet)
          })
          res.render('userListing', {
            dataSet: data,
            sortFirst: sortTypeFirst,
            sortLast: sortTypeLast
          })
        })
      }
      return;
    } else if (req.body.button === 'sortFirst') {
      if (sortTypeFirst === "Ascend") {
        dbo.collection("users").find().sort({firstName: 1}).toArray((err, result) => {
          let data = [];
          if (err) throw err;
          result.forEach(dataSet => {
            data.push(dataSet)
          })
          res.render('userListing', {
            dataSet: data,
            sortFirst: sortTypeFirst,
            sortLast: sortTypeLast
          })

        })
        sortTypeFirst = "Descend"
      } else {
        sortTypeFirst = "Ascend"
        dbo.collection("users").find().sort({firstName: -1}).toArray((err, result) => {
          let data = [];
          if (err) throw err;
          result.forEach(dataSet => {
            data.push(dataSet)
          })
          res.render('userListing', {
            dataSet: data,
            sortFirst: sortTypeFirst,
            sortLast: sortTypeLast
          })

        })
      }
      return
    } else if (req.body.button === 'sortLast') {
      if (sortTypeLast === "Ascend") {
        dbo.collection("users").find().sort({lastName: 1}).toArray((err, result) => {
          let data = [];
          if (err) throw err;
          result.forEach(dataSet => {
            data.push(dataSet)
          })
          res.render('userListing', {
            dataSet: data,
            sortFirst: sortTypeFirst,
            sortLast: sortTypeLast
          })

        })
        sortTypeLast = "Descend"
      } else {
        sortTypeLast = "Ascend"
        dbo.collection("users").find().sort({lastName: -1}).toArray((err, result) => {
          let data = [];
          if (err) throw err;
          result.forEach(dataSet => {
            data.push(dataSet)
          })
          res.render('userListing', {
            dataSet: data,
            sortFirst: sortTypeFirst,
            sortLast: sortTypeLast
          })

        })
      }
      return;
    } else {
      myobj = {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, age: req.body.age};
      dbo.collection("users").insertOne(myobj, (err, res) => {
        if (err) throw err;
        console.log("1 document inserted");
      });
    }
    dbo.collection("users").find({}).toArray(function (err, result) {
      let data = []
      if (err) throw err;
      result.forEach(dataSet => {
        data.push(dataSet)
      })
      res.render('userListing', {
        dataSet: data,
        sortFirst: sortTypeFirst,
        sortLast: sortTypeLast
      })
    });

  });


  app.get('/user', (req, res) => {
    let data = [];
    dbo.collection("users").find({}).toArray(function (err, result) {
      if (err) throw err;
      result.forEach(dataSet => {
        data.push(dataSet)
      })
      res.render('userListing', {
        dataSet: data,
        sortFirst: sortTypeFirst,
        sortLast: sortTypeLast
      })
    });
  });


  app.get('/edit/:userId', (req, res) => {
    dbo.collection("users").find({"_id": new ObjectId(req.params.userId)}).toArray(function (err, result) {
      if (err) throw err;
      res.render('edit', {
        id: req.params.userId,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        email: result[0].email,
        age: result[0].age
      })
    });
  });


  app.listen(port, () => {
    console.log("listening to port " + port)
  });
});


