import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "User Not Found" });
        console.log("object1")
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            console.log("object2", password, user.password)
            return res.status(401).json({ message: "Invalid credentials" });
        }
        console.log("object3")
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log("object4")

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
