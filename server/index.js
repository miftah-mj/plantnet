require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const nodemailer = require("nodemailer");

const port = process.env.PORT || 5000;
const app = express();

// middleware
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://plantnet-2fd54.web.app",
        "https://plantnet-2fd54.firebaseapp.com",
    ],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send({ message: "unauthorized access" });
        }
        req.user = decoded;
        next();
    });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mx1xh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        const db = client.db("plantNet");
        const usersCollection = db.collection("users");
        const plantsCollection = db.collection("plants");
        const purchasesCollection = db.collection("purchases");

        // Middleware to verify admin
        const verifyAdmin = async (req, res, next) => {
            // console.log("data from verifyToken--->", req.user?.email);
            const email = req.user?.email;
            const query = { email };
            const result = await usersCollection.findOne(query);
            if (!result || result?.role != "admin")
                return res.status(403).send({
                    message:
                        "Forbidden access!! Only Admins can perform this action.",
                });

            next();
        };

        // Middleware to verify seller
        const verifySeller = async (req, res, next) => {
            // console.log("data from verifyToken--->", req.user?.email);
            const email = req.user?.email;
            const query = { email };
            const result = await usersCollection.findOne(query);
            if (!result || result?.role != "seller")
                return res.status(403).send({
                    message:
                        "Forbidden access!! Only Sellers can perform this action.",
                });

            next();
        };

        /**
         *
         * Users API
         *
         */
        // Save or update user data in the database
        app.post("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = req.body;
            // check if user exists in the database
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send(existingUser);
            }
            const result = await usersCollection.insertOne({
                ...user,
                role: "customer",
                timestamp: Date.now(),
            });
            res.send(result);
        });

        // Manage user status and role
        app.patch("/users/:email", verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            if (!user || user?.status === "requested")
                return res
                    .status(400)
                    .send(
                        "You have already requested to become a seller. Please wait for approval."
                    );

            const updateDoc = {
                $set: {
                    status: "requested",
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        // Get all users data except the current user
        app.get(
            "/all-users/:email",
            verifyToken,
            verifyAdmin,
            async (req, res) => {
                const email = req.params.email;
                const query = { email: { $ne: email } };
                const users = await usersCollection.find(query).toArray();
                res.send(users);
            }
        );

        // Update user role and status
        app.patch(
            "/users/role/:email",
            verifyToken,
            verifyAdmin,
            async (req, res) => {
                const email = req.params.email;
                const { role } = req.body;
                const filter = { email };

                const updateDoc = {
                    $set: {
                        role,
                        status: "verified",
                    },
                };
                const result = await usersCollection.updateOne(
                    filter,
                    updateDoc
                );
                res.send(result);
            }
        );

        // Get user role
        app.get("/users/role/:email", verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ role: user?.role });
        });

        /**
         *
         * JWT Authentication
         *
         */
        // Generate jwt token
        app.post("/jwt", async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "365d",
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production" ? "none" : "strict",
            }).send({ success: true });
        });
        // Logout
        app.get("/logout", async (req, res) => {
            try {
                res.clearCookie("token", {
                    maxAge: 0,
                    secure: process.env.NODE_ENV === "production",
                    sameSite:
                        process.env.NODE_ENV === "production"
                            ? "none"
                            : "strict",
                }).send({ success: true });
            } catch (err) {
                res.status(500).send(err);
            }
        });

        /**
         *
         * Plants
         *
         */
        // Save plant data in the database
        app.post("/plants", verifyToken, verifySeller, async (req, res) => {
            const plant = req.body;
            const result = await plantsCollection.insertOne(plant);
            res.send(result);
        });

        // Get all plants from the database
        app.get("/plants", async (req, res) => {
            const plants = await plantsCollection.find().limit(20).toArray();
            res.send(plants);
        });

        // Get a plant by id
        app.get("/plants/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const plant = await plantsCollection.findOne(query);
            res.send(plant);
        });

        // Get inventory data for seller
        app.get(
            "/seller-inventory",
            verifyToken,
            verifySeller,
            async (req, res) => {
                const email = req.user.email;
                const inventory = await plantsCollection
                    .find({ "seller.email": email })
                    .toArray();
                res.send(inventory);
            }
        );

        // Delete a plant by id
        app.delete(
            "/plants/:id",
            verifyToken,
            verifySeller,
            async (req, res) => {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await plantsCollection.deleteOne(query);
                res.send(result);
            }
        );

        /**
         *
         * Purchase
         *
         */
        // Save purchase data in the database
        app.post("/purchases", verifyToken, async (req, res) => {
            const purchase = req.body;
            console.log(purchase);
            const result = await purchasesCollection.insertOne(purchase);
            res.send(result);
        });

        // Update plant quantity
        app.patch("/plants/quantity/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            const { quantityUpdate, status } = req.body;
            const filter = { _id: new ObjectId(id) };

            let updateDoc = {
                $inc: {
                    quantity: -quantityUpdate,
                },
            };
            if (status === "increase") {
                updateDoc = {
                    $inc: {
                        quantity: quantityUpdate,
                    },
                };
            }

            const result = await plantsCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Get all purchases for a specific customer
        app.get("/customer-purchases/:email", verifyToken, async (req, res) => {
            const email = req.params.email;
            const query = { "customer.email": email };

            // aggregate query to join purchases with plants
            const purchases = await purchasesCollection
                .aggregate([
                    { $match: query }, // filter purchases by customer email
                    {
                        $addFields: {
                            // add a new field to the document
                            plantId: {
                                $toObjectId: "$plantId",
                            },
                        },
                    },
                    {
                        $lookup: {
                            // join the purchases collection with the plants collection
                            from: "plants", // collection to join
                            localField: "plantId", // field from the purchases collection
                            foreignField: "_id", // field from the plants collection
                            as: "plant", // output array field
                        },
                    },
                    { $unwind: "$plant" }, // deconstruct the plant array
                    {
                        $addFields: {
                            name: "$plant.name",
                            image: "$plant.image",
                            category: "$plant.category",
                        },
                    },
                    { $project: { plant: 0 } }, // remove the plant field
                ])
                .toArray();
            res.send(purchases);
        });

        // Get all puchases for a specific seller
        app.get(
            "/seller-purchases/:email",
            verifyToken,
            verifySeller,
            async (req, res) => {
                const email = req.params.email;
                const query = { seller: email };

                const purchases = await purchasesCollection
                    .aggregate([
                        { $match: query }, // filter purchases by customer email
                        {
                            $addFields: {
                                // add a new field to the document
                                plantId: {
                                    $toObjectId: "$plantId",
                                },
                            },
                        },
                        {
                            $lookup: {
                                // join the purchases collection with the plants collection
                                from: "plants", // collection to join
                                localField: "plantId", // field from the purchases collection
                                foreignField: "_id", // field from the plants collection
                                as: "plant", // output array field
                            },
                        },
                        { $unwind: "$plant" }, // deconstruct the plant array
                        {
                            $addFields: {
                                name: "$plant.name",
                            },
                        },
                        { $project: { plant: 0 } }, // remove the plant field
                    ])
                    .toArray();
                res.send(purchases);
            }
        );

        // Update the status of a purchase
        app.patch(
            "/purchases/:id",
            verifyToken,
            verifySeller,
            async (req, res) => {
                const id = req.params.id;
                const { status } = req.body;
                const filter = { _id: new ObjectId(id) };

                const updateDoc = {
                    $set: {
                        status,
                    },
                };
                const result = await purchasesCollection.updateOne(
                    filter,
                    updateDoc
                );
                res.send(result);
            }
        );

        // Delete a purchase
        app.delete("/purchases/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const purchase = await purchasesCollection.findOne(query);
            if (purchase.status === "Delivered")
                return res
                    .status(409)
                    .send("Cannot delete a delivered purchase");
            const result = await purchasesCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello from plantNet Server..");
});

app.listen(port, () => {
    console.log(`plantNet is running on port ${port}`);
});
