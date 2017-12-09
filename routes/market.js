const express = require("express");
const router = express.Router();
const mongojs = require('mongojs');
let db = mongojs('mongodb://sieunhan:trada1234@ds127978.mlab.com:27978/trada', ['Item']);

router.get("/",function(req, res){
    res.render("marketplace.html");
});


function find_item_name(string){
  var result = db.Item.find({'item': 'string'});
  return result;
}

function find_item_price(string){
  var result = db.Item.find({'price': 'string'});
  return result;
}


//ADD_ITEM
router.get("/add_item", (req, res) => {
    res.render("add_item.html");
});

router.post('/add_item', (req, res) => {
  req.checkBody('item_name', 'Item name is required').notEmpty();
	req.checkBody('description', 'Description is required').notEmpty();

  let errors = req.validationErrors();

  if(errors) {
		res.render('add_item.html', {
			errors: errors
		});
	} else {
		let newItem = {
			item: req.body.item_name,
			price: req.body.price,
			description: req.body.description,
			comment: req.body.comment
		}
    db.Item.insert(newItem, function(err, item){
      if(err) { throw err; }
      res.redirect('/market');
    });
    }
});
//END ADD_ITEM

//UPDATE_ITEM
router.get("/update_item", (req, res) => {
    res.render("update_item.html");
});

router.post('/update_item', (req, res) => {
		let newItem = {
			item: req.body.item_name,
			price: req.body.price,
			description: req.body.description,
			comment: req.body.comment
		}
    db.Item.update({item: newItem.item}, newItem, function(err, item){
      if(err) { throw err; }
      res.redirect('/market');
    });
});



//DELETE_ITEM
router.get("/delete_item", (req, res) => {
    res.render("delete_item.html");
});

router.post('/delete_item', (req, res) => {
		let newItem = {
			item: req.body.item_name,
		}
    db.Item.remove({item: newItem.item}, function(err, item){
      if(err) { throw err; }
      res.redirect('/market');
    });
});



module.exports = router;
