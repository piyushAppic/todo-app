const express = require('express')

const router = express.Router()

const {register, login, createTodo, getAllTodo, editTodo, deleteTodo } = require("../controller/userController")
const {auth} = require("../middlewares/auth")

router.post("/signup", register)
router.post("/login", login)
// router.post("/logout", logout)


// todo list router
router.post("/addTodo", auth, createTodo)
router.post("/getAllTodo", auth, getAllTodo)
router.put("/editTodo/:id", auth, editTodo)
router.delete("/deletTodo/:id", auth, deleteTodo)



module.exports = router