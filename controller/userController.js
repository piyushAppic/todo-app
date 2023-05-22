const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require("../model/user")
const todoModel = require("../model/todos")


const register = async(req, res) => {
    try{
        let {name, email, password} = req.body
        if (!name || !email || !password){
            return res.json({message:"please provide name,email or password"})
        }

        const isUserExist = await userModel.findOne({email})
        if(isUserExist){
            return res.json({message:"user already registered please login !!"})
        }else{
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    // Handle error
                    return res.json({message:err.message})
                }

                bcrypt.hash(password, salt, async(err, hash) => {
                    if (err) {
                    // Handle error
                    return res.json({message:err.message})
                    }

                    // Store the hash in the database or use it as needed
                    console.log('Hashed password:', hash);
                    let newUser = new userModel({name, email, password:hash})
                    await newUser.save()
                    return res.json({message:"user registered successfully"})
                });
                });
            
        }
    }catch(err){
        return res.json({message:err.message})
    }   
}


const login = async (req, res) => {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        return res.json({ message: "Please provide email and password" });
      }
  
      const isUserExist = await userModel.findOne({ email });
      if (!isUserExist) {
        return res.json({ message: "User is not registered, please sign up first!" });
      }
  
      const isMatch = await bcrypt.compare(password, isUserExist.password);
      console.log(password, isUserExist.password, "userpass, hashedDbpass, passwords");
  
      if (isMatch) {
        // If password matched, create JSON token
        const payload = { email, id: isUserExist._id };
        const secretKey = process.env.json_secret_key;
        const token = jwt.sign(payload, secretKey);
        return res.json({ message: "User logged in successfully", token });
      } else {
        return res.json({ message: "Entered password is not correct!" });
      }
    } catch (err) {
      return res.json({ message: err.message });
    }
};

const createTodo = async(req, res) => {
    try{
        // console.log(req.user, "setup in auth middleware")
        const {id} = req.user
        const {content} = req.body
        if (!content) {
            return res.json({message: "please provide todo task content !!"})
        }
        let newTodo = new todoModel({content, user_id: id})
        await newTodo.save()
        return res.json({message: "added todo", newTodo})

    }catch(err){
        return res.json({message: err.message})
    }
}

const getAllTodo = async(req, res) => {
    try{
        // console.log(req.user, "setup in auth middleware")
        const {id} = req.user
        let AllTodo = await todoModel.find({user_id: id}).sort({"createdAt":1})
        return res.json({message: "added todo", AllTodo})

    }catch(err){
        return res.json({message: err.message})
    }
}

const editTodo = async(req, res) => {
    try{
        const { content } = req.body
        const id = req.params.id
        const payload = {$set: {"content": content}}
        let editTodo = await todoModel.findOneAndUpdate({_id: id}, payload)
        return res.json({message: "update todo successfully !!", editTodo})

    }catch(err){
        return res.json({message: err.message})
    }
}

const deleteTodo = async(req, res) => {
    try{
        const id = req.params.id
        let editTodo = await todoModel.findOneAndDelete({_id: id})
        return res.json({message: "delete todo successfully !!", editTodo})

    }catch(err){
        return res.json({message: err.message})
    }
}

  

module.exports = { register, login, createTodo, getAllTodo, editTodo, deleteTodo }