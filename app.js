const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

//creating the app/server
const app = express();

//using body-parser
app.use(bodyparser.urlencoded({ extended: true }));

//setting the view engine
app.set('view engine', 'ejs');
//using the css and js
app.use(express.static("public"));

//this array is storing all the latest inputs 
// let items = [];
// let workitems = [];

///////new database connection is made here and arrays are not used anymore
mongoose.connect("mongodb://localhost:27017/todolistDB");
//creating a schema
const taskschema = {
    name: String,

};

//mongoose model
const item = mongoose.model("item", taskschema);

//mongoose 
const task1 = new item({
    name: "Welcome to do list"
});
const task2 = new item({
    name: "Lets do some work"
});
const task3 = new item({
    name: "do what you love"
});

//now creating a doc and inserting many option
const defaultitems = [task1, task2, task3];





app.get('/', (req, res) => {

    // to render  date and day
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);
    // /////////////////////////////////////////////////////////////////
    // finding the search item 
    item.find({}, function (err, foundItems) {
        // console.log(foundItems);

        if (foundItems.length === 0) {

            item.insertMany(defaultitems, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("chl gya bhai!!!");
                }
            });
            res.redirect("/");

        }else{
            res.render("index", { listmode: day, newlistitems: foundItems });
        }



    });




});

app.post("/", (req, res) => {
    const itemname = req.body.newitem;

    const items  = new item({
        name: itemname
    });

    items.save();
    res.redirect("/");



    // if (req.body.list === "Work") {
    //     workitems.push(item);
    //     res.redirect("/work");
    // }
    // else {
    //     items.push(item);
    //     res.redirect("/");
    // }



});

app.post("/delete" , function(req, res) {
   const  delitemid = req.body.chbox;
   console.log(delitemid);
   item.findByIdAndRemove(delitemid,function(err) {
    if(!err){
        console.log("item deleted");
        res.redirect("/");
    }
   })


});

app.get("/work", (req, res) => {
    res.render("index", { listmode: "Work", newlistitems: workitems });
})

// app.post("/work", (req, res) => {
//     let items = req.body.newitem;
//     workitems.push(items);
//     res.redirect("/work");
// });



app.listen(8080, function () {
    console.log("server is started on port 8080")
})