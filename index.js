const express = require('express');
const cors = require('cors');

const { getAllBeverages,
    getMenuItemById, 
    getAllMeals,
    getAllSnacks,
    getUserFavourites,
    removeUserFavourite,
    setUserFavourite,
    createUser,
    getFavouriteDetails,
    submitContactMessage,
    getTopOrderedItems,
    gettop10menuItems,
    getBottom10MenuItems,
    getSpecialItems,
    getAllCombos,
    getCombos } = require('./queries');

const { error } = require('console');

const verifyToken = require('./middleware/authMiddleware.js');
const orderRoutes = require("./routes/orders.js");
const receiptRoutes = require("./routes/receipts.js");

const app = express();
const port = process.env.PORT || 5050;

// Configure CORS with specific options for production
const allowedOrigins = [
  'http://food-ordering-software.vercel.app',
  'https://food-ordering-software.vercel.app',  // add this
  'http://localhost:5173',                        // add for local dev
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/orders", orderRoutes);
app.use("/receipt", receiptRoutes);

// Add response headers middleware for additional security
app.get("/", (req, res) => {
    res.send("Backend is live!");
});

app.get('/top-ordered-items', async (req, res) => {
    try {
        const topItems = await getTopOrderedItems();
        res.json(topItems);
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

app.get('/special-items', async (req, res) => {
    try {
        const specialItems = await getSpecialItems();
        res.json(specialItems);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/combos', verifyToken, async (req, res) => {
    try {
        const combos = await getAllCombos();
        let favouriteList = await getUserFavourites(req.user.uid);
        favouriteList = favouriteList.map((e) => (e.item_id));
        res.json({ combos, favouriteList });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/beverages', verifyToken, async (req, res) => {
  try {
      const beverages = await getAllBeverages();
      res.json({beverages});
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/snacks', verifyToken, async(req, res) => {
    try {
        const snacks = await getAllSnacks();
        res.json({snacks});
    } catch(error) {
        console.error(error.message);
        res.status(500).json({error : 'Internal Server error'})
    }
});

app.get('/meals', verifyToken, async (req, res) => {
    try {
        const meals = await getAllMeals();
        res.json({meals});
    } catch(error) {
        console.error(error.message);
        res.status(500).json({error : 'Internal server error'});
    }
});

app.post('/users', async (req, res) => {
    try {
        const userData = req.body;

        if (!userData.uid) {
            console.error("Missing UID in request");
            return res.status(400).json({ error: 'User ID (uid) is required' });
        }

        if (!userData.email) {
            console.error("Missing email in request");
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await createUser(userData);
        console.log("User created successfully:", user);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error in /users route:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

app.post("/contact-us", verifyToken, async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) 
        return res.status(400).json({ error: "All fields are required" });
    try {
        const savedMessage = await submitContactMessage(name, email, subject, message);
        res.status(201).json({
            message: "Your message has been sent successfully!",
            data: savedMessage,
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/top', async(req, res) => {
    try {
        console.log("Entering the function");
        const items = await gettop10menuItems();
        res.json({
            status: 200,
            result: items.rows
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).json({error: 'error in top 10 routing'});
    }
});

app.get('/bottom', async(req, res) => {
    try {
        const items = await getBottom10MenuItems();
        res.json({
            status: 200,
            result: items.rows
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).json({error: 'error in bottom 10 routing'});
    }
});

app.get('/getCombos', async(req, res) => {
    try {
        const combos = await getCombos();
        res.json({
            status: 200, result: combos
        });
    } catch(error) {
        console.error(error.message);
        res.status(500).json({
            error: 'error in fetching combos '
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend Server Started on port ${port}`);
});