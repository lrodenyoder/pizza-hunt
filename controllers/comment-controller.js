const { Comment, Pizza } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    //mondoDB functions start with $ and may work similar to vanilla JS
                    { $push: { comments: _id } },
                    //will receive back the pizza with new comment added
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: "Pizza not found" });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err))
     },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: "Comment not found" });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                )
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: "Pizza not found" });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
     }
};

module.exports = commentController;