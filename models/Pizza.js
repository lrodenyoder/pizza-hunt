const { Schema, model } = require('mongoose');

//mongoDB uses default js data types

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
    //alt toppings: Array
});

//create Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

//export Pizza model
module.exports = Pizza;