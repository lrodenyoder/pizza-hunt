//create variable to store db connection object

let db;

//establish connection to INdexed DB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

//this event will emit if the db version changes
request.onupgradeneeded = function (event) {
    //save a reference to the db
    const db = event.target.result;

    //create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

//upon successful
request.onsuccess = function (event) {
    //when db is successfully created with object store, or established connection, save reference to db in global variable
    db = event.target.result;

    //check if app is online, if yes uploadPizza() to send all local db data to api
    if (navigator.online) {
        uploadPizza();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

//this function will be executes if we attempt to submit a new pizza without internet connection (.catch() is executed)
function saveRecord(record) {
    //open new transaction (temporary connection to the db) with the db with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to your store with this method
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    //open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //get all records from store and set to variable
    const getAll = pizzaObjectStore.getAll();
    //getAll() is async method that requires an event handler

    //upon successful getAll() run this function
    getAll.onsuccess = function () {
        //is there was data in indexedDB's store, send it to api server
        //.result property is the array of saved data
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    //open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    //access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    //clear all items in the store
                    pizzaObjectStore.clear();

                    alert("All saved pizzas submitted")
                })
            .catch(err => console.log(err))
        }
    }
};

//listen for app to come back online
window.addEventListener('online', uploadPizza);