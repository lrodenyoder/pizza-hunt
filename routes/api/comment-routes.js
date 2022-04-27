const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

router
    .route('/:pizzaId')
    .post(addComment);

//to delete the comment, we need to know what pizza the comment comes from
router
    .route('/:pizzaId/:commentId')
    .delete(removeComment);

module.exports = router;