const user = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { Op } = require("sequelize");
const fs = require("fs");
const zip = require("zip-a-folder").zip;
const multer = require("multer");

exports.reg = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password validation (at least 8 characters, one uppercase, one lowercase, one number, and one special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters, include an uppercase, lowercase, number, and special character",
      });
    }

    // Phone validation (ensure phone number contains exactly 10 or more digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ error: "Phone number must be at least 10 digits" });
    }

    // Name validation (ensure it's a full name, contains two or more words, each word starts with a capital letter)
    const nameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: "Invalid full name format" });
    }

    const sameemail = await user.findOne({ where: { email: email } });
    if (sameemail) {
      res.status(400).send("User already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role == "admin" || role == "user") {
      await user.create({
        full_name: name,
        password: hashedPassword,
        email: email,
        phone_no: phone,
        role: role,
      });
      res.status(200).send("User Registered Successfully");
    } else {
      res.status(400).send("pls enter correct role");
    }
  } catch (error) {
    console.error("Error during registration", error);
    return res.status(500).send("Internal Server Error", error);
  }
};

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const foundUser = await user.findOne({ where: { email: Email } });
    if (!foundUser) {
      return res.status(404).send("pls enter correct credentials");
    } else {
      const passwordMatch = await bcrypt.compare(Password, foundUser.password);
      if (!passwordMatch) {
        return res.status(404).send("pls enter correct credentials");
      }
      const userData = foundUser.toJSON();
      delete userData.password;
      const token = jwt.sign(userData, "top_secret_key", {
        expiresIn: "10h",
      });
      res.status(200).json(token);
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send("pls enter correct credentials");
  }
};

exports.data = async (req, res) => {
  const user = req.user;
  if (user.role == "admin") {
    res.status(200).send("welcome admin");
  } else {
    res.status(200).send("welcome user");
  }
};

exports.create = async (req, res) => {
  fs.writeFile("example.txt", "Hello, World!", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return;
    }
  });

  fs.readFile("example.txt", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    res.status(200).send(`File has been written, ${data}`);
  });
};

exports.delete = async (req, res) => {
  fs.unlink("example.txt", (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    res.status(200).send("delete done");
  });
};

exports.json_file = async (req, res) => {
  const data = {
    name: "Anirudh",
    email: "anirudh@gmail.com",
  };
  const jsonString = JSON.stringify(data);
  fs.writeFile("example.json", jsonString, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return;
    } else {
      res.send("file created");
    }
  });
};

exports.read_json = async (req, res) => {
  fs.readFile("example.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const json_data = JSON.parse(data);
    res.status(200).json(json_data);
  });
};

exports.makedirt = (req, res) => {
  fs.mkdir("mydir", { recursive: true }, async (err) => {
    if (err) throw res.send(err);
    await zip("mydir", "mydir_zip.zip");
    res.send("Directories created!");
  });
};

exports.upload=(req,res)=>{
    res.send("uploaded")
}