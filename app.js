const express = require('express');
const date = require(__dirname + "/date.js");

const app = express();
const items = [];
const workItems = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let day = date()
  // console.log(day)
  res.render('list', { listTitle: day, newListItems: items });
});

app.post('/', (req, res) => {
  let item = req.body.newItem;
  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work")
  }
  else {
    items.push(item)
    res.redirect('/');
  }
});

app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work list', newListItems: workItems });
});

app.post('/work', (req, res) => {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
