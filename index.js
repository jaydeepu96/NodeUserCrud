const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 5001;

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rbalqrz.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));

// Create a User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

// Create a User model
const User = mongoose.model("User", userSchema);

app.use(express.json());

// CRUD Routes
// Create a new user
app.post("/users", (req, res) => {
  const { name, email, phone } = req.body;
  const user = new User({ name, email, phone });
  user
    .save()
    .then((result) => res.json(result))
    .catch((error) => res.status(400).json({ error: error.message }));
});

// Get all users
app.get("/users", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((error) => res.status(400).json({ error: error.message }));
});

// Update a user
app.put("/users/:id", (req, res) => {
  const { name, email, phone } = req.body;
  User.findByIdAndUpdate(req.params.id, { name, email, phone })
    .then(() => res.json({ message: "User updated successfully" }))
    .catch((error) => res.status(400).json({ error: error.message }));
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch((error) => res.status(400).json({ error: error.message }));
});
