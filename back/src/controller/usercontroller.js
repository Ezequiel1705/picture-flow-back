import mongoose from "mongoose";
import { uploadImage } from "../libs/cloudinary.js";
import User from "../models/users.js";
import fs from "fs-extra";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
}

export const getUser = async (req, res) => {

    const { id } = req.params

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID de usuario no válido");
        }

        const user = await User.findById(id).select('-password')

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;

    let avatar = null

    if(req.files?.avatar) {
        const result = await uploadImage(req.files.avatar.tempFilePath, 'avatars');
        await fs.remove(req.files.avatar.tempFilePath);
        avatar = result.secure_url
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID de usuario no válido");
        }

        const propertiesToUpdate = ['username', 'name', 'lastName', 'description'];

        // Verificamos si las propiedades tienen algun contenido
        const toUpdate = {};
        propertiesToUpdate.forEach(prop => {
           

            if (req.body[prop]) {
                toUpdate[prop] = req.body[prop];
            }
        });

        if (avatar) toUpdate.avatar = avatar;
        


        const updatedUser = await User.findByIdAndUpdate(
            id,
            toUpdate,
            { new: true } // Devuelve el documento actualizado
        ).select('-password');
        

        if (!updatedUser) {
            return res.status(404).send("Usuario no encontrado");
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error : "ID del usuario no válido"});
        }

        const deletedUser = await User.findOneAndDelete({ _id: id });

        // Verificar si el usuario existe
        if (!deletedUser) {
            return res.status(404).json({ error: "Publicación no encontrada" });
        }
        
        return res.status(200).json({ message: "Usuario eliminado exitosamente", deletedUser });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
}

export const savePin = async (req, res) => {
    const { userId } = req.params
    const { pinId } = req.body
    try {
        
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(pinId)) {
            return res.status(400).json({ error: "La ID de los parámetros y los datos no son correctos" });
        }

        const newSave = {
            pinId
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { saves: newSave }, 
            },
            { new: true } 
        );

        if (!updateUser) {
            return res.status(404).json({ error: "El usuario no fue encontrado" });
        }

        return res.status(200).json(updateUser);


    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

export const getSavedByUser = async (req, res) => {
    const { userId } = req.params

    try {
        const userFounded = await User.findById(userId)
        .populate({
            path: "saves.pinId",
            select: "_id image title photographer",
            populate: {
                path: "photographer",
                select: "name lastName username avatar",
            },
        })

        if (!userFounded) {
            return res.status(404).json({ error: "El usuario no fue encontrado" });
        }

        const savesUser = userFounded.saves || [];

        // Transforma la estructura para aplanar el objeto pinId
        const saves = savesUser.map((save) => {
            return {
                _id: save._id,
                image: save.pinId.image,
                title: save.pinId.title,
                photographer: save.pinId.photographer,
            };
        });

        return res.status(200).json(saves);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

export const deleteSavedByUser = async (req, res) => {
    const { userId, saveId } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { saves: { _id: saveId } },
            },
            { new: true } 
        );
        
        if (!updatedUser) {
            return res.status(404).json({ error: "El usuario no fue encontrado" });
        }

        // Devuelve el usuario actualizado, que ya no contiene la save eliminada
        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};