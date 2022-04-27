const router = require('express').Router();
const { addComment, addReply, removeComment, removeReply } = require('../../controllers/comment-controller');

router
    .route('/:pizzaId')
    .post(addComment);

//to delete the comment, we need to know what pizza the comment comes from
router
    .route('/:pizzaId/:commentId')
    //PUT instead of POST because we are just updating the comment resource
    .put(addReply)
    .delete(removeComment);

router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply);

module.exports = router;