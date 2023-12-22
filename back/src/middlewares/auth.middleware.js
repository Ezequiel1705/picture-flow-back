import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//------------------//
//--Generar token--//
//------------------//
export function generateToken (user) {
    const token = jwt.sign({ data: user}, process.env.SECRET_KEY, {expiresIn: '144h'})
    return token;
};


//-------------------------------//
//--Middleware de verificacion--//
//-----------------------------//
export function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Not authenticated"
        });
    }
    const token = authHeader = authHeader.split(' ') [1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: "not authorized"
            });
        }

        req.user = decoded.data;
        next();
    });
};

