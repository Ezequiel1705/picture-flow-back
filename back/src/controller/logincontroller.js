import User from "../models/users.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../middlewares/auth.middleware.js";

/* registro */

export const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    console.log(req.body);
    /* if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: "La contraseña es inválida" });
    } */
    try {

        const userFind = await User.findOne({email: email})

        if (userFind) return res.status(404).json({error: "El email ya existe"}) 

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User ({
                username,
                email,
                password: passwordHash,
            });
            
        await newUser.save();
        const acess_token = generateToken(newUser)
        return res.status(200).json({acess_token, newUser, creado: "true"});

    } catch (error) {
        console.log(error)
    }
};

/* login */
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).send({ error: "user vacío" });
    } else if (!password) {
        return res.status(400).send({ error: "Contraseña vacía" });
    }

    try {
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ error : "El email o la contraseña son incorrectas" })

        const matchPassword = await bcrypt.compare(password, user.password);
        
        if(!matchPassword) return res.status(404).json({ error : "El email o la contraseña son incorrectas" })

        const acess_token = generateToken(user)

        return res.status(200).json({acess_token, user: user, logged: "true" });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error : "Error interno del servidor"});
    }
};