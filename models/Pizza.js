const { Schema, model } = require("mongoose");
const dateFormat = require('../utils/dateFormat');

//mongoDB uses default js data types

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
        default: Date.now,
        //every time data is retrieved, the date will be formatted by the util function
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: "Large",
    },
    toppings: [],
    //alt toppings: Array
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
          virtuals: true,
        getters: true
    },
    id: false,
  }
);

PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

//create Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

//export Pizza model
module.exports = Pizza;
