const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    image: {
      type: String,
      default: "https://via.placeholder.com/200/92c952"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
