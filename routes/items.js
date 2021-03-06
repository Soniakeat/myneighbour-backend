const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const { isLoggedIn } = require("../helpers/middlewares");


//GET all items
router.get("/", isLoggedIn(), async (req, res, next) => {
  try {
    const allItems = await Item.find();
    res.json(allItems.reverse());
  } catch (error) {
    console.log("items route");
    next(error);
  }
});

//GET One Item / Contacts item 
router.get("/:id", isLoggedIn(), async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const oneItem = await Item.findById(itemId)
      .populate("owner")
      .populate("contacts");
    res.json(oneItem);
  } catch (error) {
    next(error);
  }
});

//POST Add One Item
router.post("/add", isLoggedIn(), async (req, res, next) => {
  try {
    console.log(req.body);
    const { title, description, avatarURL } = req.body;
    const ownerId = req.session.currentUser._id;
    const newItem = await Item.create({
      title,
      description,
      image: avatarURL,
      owner: ownerId
    });
    res.json(newItem);
  } catch (error) {
    next(error);
  }
});

//PUT Edit One Item
router.patch("/edit/:id", isLoggedIn(), async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const { title, description, avatarURL } = req.body;
    const ownerId = req.session.currentUser._id;
    const item = await Item.findById(itemId);
    if (item.owner.equals(ownerId)) {
      const newItem = await Item.findByIdAndUpdate(
        itemId,
        {
          title,
          description,
          image: avatarURL
        },
        {
          new: true
        }
      );
      res.json(newItem);
    } else {
      res.json("You cant update this item");
    }
  } catch (error) {
    next(error);
  }
});

//DELETE Delete One Item
router.delete("/:id", isLoggedIn(), async (req, res, next) => {
  try {
    const ownerId = req.session.currentUser._id;
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (item.owner.equals(ownerId)) {
      const deletedItem = await Item.findByIdAndDelete(itemId);
      res.json(deletedItem);
    } else {
      res.json("You cant delete this item");
    }
  } catch (error) {
    next(error);
  }
});

//PUT Add Contact to Item
router.put("/:id/contact/add", isLoggedIn(), async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    let newContacts;
    if (item.contacts.includes(userId)) {
      newContacts = [...item.contacts];
    } else {
      newContacts = [...item.contacts, userId];
    }
    const itemWithContact = await Item.findByIdAndUpdate(
      itemId,
      {
        contacts: newContacts
      },
      {
        new: true
      }
    );
    res.json(itemWithContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
