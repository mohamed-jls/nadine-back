const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection Function
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://nadineismaili92:9lQOXHBJ9jYehrRt@cluster0.wei7l7w.mongodb.net/shop");
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

// Connect to Database
connectDB();
var userschema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

var usermodel = mongoose.model("user", userschema, "user");

var productschema = mongoose.Schema({
    productname: {
        type: String,
        required: true,
    },
    price: Number,
    image: String,
    description: String,
    category: String,
    gender: String,
})
var productmodel = mongoose.model("product", productschema );

app.use((req,res,next) => {
    console.log(req.method, req.path);
    next();
})

app.get('/products', async (req, res) => {

    try {
        const product = await productmodel.find();
        res.json(product);
    } catch (error) {
        res.status((500).send("error"))
    };
}
)

app.get("/users/:id", async (req, res) => {
    try {
        const user = await usermodel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const product = await productmodel.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
});

// problem fi post user (image , adresse)

// app.post("/users", async (req, res) => {
//     try {
//         const newUser = new usermodel(req.body);
//         await newUser.save();
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(500).json({ message: "Error adding user" });
//     }
// });

app.post('/products', async (req, res) => {
    const product = req.body;
    const newproduct = new productmodel(product);
    try {
        await newproduct.save();
        res.json(newproduct);
    } catch (error) {
        res.status(500).send("error");

    }
});
app.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const product = req.body;
    try {
        const newProd = await productmodel.findByIdAndUpdate({ _id: id }, { $set: product });
        res.json(newProd);
    } catch (error) {
        res.status(500).send("error");
    }

});

app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const newProd = await productmodel.findByIdAndDelete({ _id: id });
        res.json(newProd);
    } catch (error) {
        res.status(500).send("error");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
