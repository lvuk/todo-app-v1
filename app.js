const express = require('express');
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin:admin@cluster0.hymhv.mongodb.net/todolistDB", {
  useNewUrlParser: true
}, (err) => {
  if(err) console.log(err)
  else console.log("Successfully connected")
});

const itemSchema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
  name: "Welcome to your todo list"
})

const item2 = new Item({
  name: "Hit the + button to add a new item"
})

const item3 = new Item({
  name: "<-- Hit this to delete"
})

const defaultItems = [item1, item2, item3];

const listSchema = {
  name:String,
  items: [itemSchema]
 }

 const List = mongoose.model("List", listSchema);



app.get('/', (req, res) => {
  Item.find({}, (err, foundItems) => {
    console.log(foundItems);
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, (err) => {
        if(err) console.log(err);
        else console.log("Successfully added default items");
      })
      res.redirect("/")
    }
    else {
      res.render('list', { listTitle: "Today", newListItems: foundItems });
    } 
  })
 
});

app.post('/', (req, res) => {
  const item = new Item ({
    name: req.body.newItem
  })
  const listName = req.body.list

  if(listName === "Today"){
    item.save()
    res.redirect("/")
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item)
      foundList.save();
      res.redirect("/"+listName)
    })
  }


 
});

app.post("/delete", (req,res) => {
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, (err) =>{
      if(!err){ 
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {_id: checkedItemId}}},
      (err, foundList) => {
        if(!err){
          res.redirect("/"+listName)
        }
      }
    )
  }
});


app.get("/:customList", (req,res) => {
 const customListName = _.capitalize(req.params.customList)
 List.findOne({name: customListName}, (err, foundList) => {
  if(!err){
    if(!foundList){
      //create new list
      const list = new List({
        name: customListName,
        items: defaultItems
       })
      
       list.save()
       res.redirect("/:"+customListName)
    }
    else {
      //show existing

      res.render("list",{listTitle: customListName, newListItems: foundList.items})
    }
  } 
 })
 
 
 
})

app.post('/work', (req, res) => {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
