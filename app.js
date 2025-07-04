const express = require("express");
const app = express();
const port =  process.env.PORT || 3001;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
const User = require("./models/customerSchema");
app.set("view engine", "ejs");
app.use(express.static("public"));
var moment = require("moment");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// GET Requst
app.get("/", (req, res) => {
  // result ==> array of objects
  console.log("--------------------------------------------");
  User.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

app.get("/edit/:id", (req, res) => {
  User.findById(req.params.id)
  .then((result) => {
    res.render("user/edit", { obj: result, moment: moment });
  })
  .catch((err) => {
    console.log(err);
  });



 
});

app.get("/view/:id", (req, res) => {
  // result ==> object
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST Requst
app.post("/user/add.html", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});


// Search
app.post("/search", (req, res) => {
   console.log(req.body.textsearch);

  const search = req.body.textsearch.trim();
  
  User.find({ $or: [{fireName: search}, {lastName: search}
] })

    .then((result) => {
      console.log(result);
      res.render("user/search", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
}); 


// DELETE Request
app.delete("/edit/:id", (req, res) => {
  User.deleteOne({_id: req.params.id})
    .then((result) => {
      res.redirect("/");
      console.log(result)
    })
    .catch((err) => {
      console.log(err);
    });
});


// PUT Request
app.put("/edit/:id", (req, res) => {
// User.findByIdAndUpdate(req.params.id, req.body)
  User.updateOne({_id : req.params.id}, req.body)
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
}); 



mongoose
  .connect(
 "mongodb+srv://achrefbougroura:achraf@cluster0.do3kqnj.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
