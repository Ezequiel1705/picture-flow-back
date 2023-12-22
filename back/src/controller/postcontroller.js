import mongoose from "mongoose";
import { uploadImage } from "../libs/cloudinary.js";
import  publications  from "../models/publications.js";
import Team from '../models/team.js'
import fs from "fs-extra";


export const allPublications = async (req, res) => {
    try {
        const photo = await publications.find()
        .populate("photographer", {
            _id: 1,
            username: 1,
            name: 1,
            lastName: 1,
            avatar: 1
        })
        if (photo.length === 0) {
            return res.status(201).send({ message: "No hay publicaciones creadas"});
        }
        return res.status(201).json(photo);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: error })
    }
};

export const getPublicationById = async (req, res) => {

    const { id } = req.params

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error : "ID de la publicacion no válido"});
        }

        const publication = await publications.findById(id)
        .populate("team", {
            teamName : 1
        })
        .populate("photographer", {
            _id: 1,
            username: 1,
            name: 1,
            lastName: 1,
            avatar: 1
        })
        .populate("comments.userId", {
            "username" : 1,
            "avatar" : 1
        });

        if(!publication) return res.status(404).json({ error: "Publicación no encontrada" });

        
        return res.status(201).json(publication);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: error })
    }
}

export const deletePublication = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error : "ID de la publicacion no válido"});
        }
          const deletedPublication = await publications.findOneAndDelete({ _id: id });

          // Verificar si la publicación existe
          if (!deletedPublication) {
              return res.status(404).json({ error: "Publicación no encontrada" });
          }
          
          if(deletedPublication?.image?.public_id) {
            await deleteImage(deletedPublication.image.public_id)
          }
          
  
          return res.status(200).json({ message: "Publicación eliminada exitosamente", deletedPublication });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error })
    }
}

export const getPublicationsByTeam = async (req, res) => {
    const { team } = req.params
    try {

        if (!mongoose.Types.ObjectId.isValid(team)) {
            return res.status(400).json({error : "ID de la publicacion no válido"});
        }

        const teamFound = await Team.findById(team)

        if (!teamFound)return res.status(400).json({error : "El equipo no existe"});

        const publicationsByTeam = await publications.find({ 'team': team })
        .populate("photographer", {
            _id: 1,
            name: 1,
            lastName: 1,
            avatar: 1
        })
        ;

        return res.status(200).json({
            team : teamFound,
            teams : publicationsByTeam
        });

    } catch (error) {
        return res.status(500).send({ error })
    }

}

export const getPublicationsByUser = async (req, res) => {
    const { userId } = req.params
    try {

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({error : "ID del usuario no valido"});
        }

        const publicationsFound = await publications.find({photographer : userId})
        .populate("photographer", {
            _id: 1,
            name: 1,
            lastName: 1,
            avatar: 1
        })


        return res.status(200).json(publicationsFound);

    } catch (error) {
        return res.status(500).send({ error })
    }
}
 
export const newPublication = async (req, res) => {
    try {
    
        const { title, description, team, tags, photographer } = req.body;
        let image = null

        if(req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath);
            await fs.remove(req.files.image.tempFilePath);
            image = {
                url : result.secure_url,
                public_id : result.public_id
            }
        }

        // const userPhoto = await users.findById(photographer);
        const newPin = {
            title,
            description,
            team,
            tags,
            image,
            time: new Date(),
            photographer
        }

        const photo = await publications(newPin);

        await photo.save();
        console.log(photo);
        //userPhoto.publications = userPhoto.publications.concat(photo._id);
        //await userPhoto.save();
        return res.status(201).send({ message: "Publicacion creada correctamente" });


    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: error })        
    }
};

export const searchPublication = async (req, res) => {
    const { query } = req.query;

    try {
        if (!query) {
            return res.status(400).json({ error: "Se requiere un título para la búsqueda." });
        }

        const result = await publications.searchByTitle(query);

        const populatedResult = await publications.populate(result, {
            path: "photographer",
            select: "_id username name lastName avatar"
        });

        return res.status(200).json(populatedResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}



export const createComment = async (req, res) => {
    const { postId } = req.params;
    const { comment, userId, date } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "La ID de los parámetros y los datos no son correctos" });
        }

        const newComment = {
            userId: userId,
            comment: comment,
            date: date || new Date(),
        };

        const updatedPost = await publications.findByIdAndUpdate(
            postId,
            {
                $push: { comments: newComment }, 
            },
            { new: true } 
        );

        // Verificar si el post existe
        if (!updatedPost) {
            return res.status(404).json({ error: "El post no fue encontrado" });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message || "Error al agregar el comentario" });
    }
};

export const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "La ID de la publicación no es válida" });
        }

        const post = await publications.findById(postId).populate("comments.userId", {
            "username" : 1,
            "avatar" : 1
        });

        if (!post) {
            return res.status(404).json({ error: "El post no fue encontrado" });
        }

        const comments = post.comments || [];

        return res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message || "Error al encontrar los comentarios" });
    }
};

export const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "La ID del post o del comentario no es válida" });
        }

        const updatedPost = await publications.findByIdAndUpdate(
            postId,
            {
                $pull: { comments: { _id: commentId } }, // Utilizamos $pull para quitar el comentario del array
            },
            { new: true } // Esto devuelve el documento actualizado
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "El post no fue encontrado" });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message || "Error al eliminar el comentario" });
    }
};

export const likePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "La ID de los parámetros y los datos no son correctos" });
        }

        const post = await publications.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "El post no fue encontrado" });
        }

        const userLiked = post.likes.some((like) => like.userId.toString() === userId);

        if (userLiked) {
            return res.status(400).json({ error: "El usuario ya ha dado like en esta publicación" });
        }

        const newLike = {
            userId: userId,
        };

        const updatedPost = await publications.findByIdAndUpdate(
            postId,
            {
                $push: { likes: newLike },
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "El post no fue encontrado" });
        }

        return res.status(200).json(updatedPost);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message || "Error al dar me gusta ala publicacion" });
    }
};

export const deleteLikePost = async (req, res) => {
    const { postId, userId } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "La ID de los parámetros y los datos no son correctos" });
        }

        const updatedPost = await publications.findByIdAndUpdate(
            postId,
            {
                $pull: { likes: { userId: userId } }, // Utilizamos $pull para quitar el like del array
            },
            { new: true } // Esto devuelve el documento actualizado
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "El post no fue encontrado" });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message || "Error al eliminar el like de la publicación" });
    }
};