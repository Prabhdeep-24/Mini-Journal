import User from '../model/user.model.js'; // FIXED: Use PascalCase for models
import bcrypt from 'bcryptjs';         // Use bcryptjs which is common
import jwt from 'jsonwebtoken';        // Don't forget to import jwt

const generateToken = (id) => {
    console.log("Generating token for id:", id);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
    console.log("Register function called"); // Add this line
    const { name, email, password } = req.body;
    console.log(`Registering user ${name} with email ${email}`);
    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        console.log(`existingUser = ${existingUser}`);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // --- SECURITY FIX: HASH THE PASSWORD ---
        const salt = await bcrypt.genSalt(10);
        console.log(`salt = ${salt}`);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with the hashed password
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        // IMPROVEMENT: Return user data and a token to log them in immediately
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token: generateToken(newUser._id)
        });
    } catch (error) {
        console.error("Registration error:", error); // Log the error for debugging
        res.status(500).json({ message: "Something went wrong" });
    }
};

const login = async (req, res) => {
    console.log("Login function called"); // Add this line
    const { email, password } = req.body; // FIXED: Corrected typo 'emial' to 'email'

    try {
        const user = await User.findOne({ email }); // FIXED: Used correct model variable 'User'

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Passwords match, send back user data and a new token
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id), // This will now work
            });
        } else {
            // Passwords do not match
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        res.status(500).json({ message: "Something went wrong" });
    }
};

export { register, login };