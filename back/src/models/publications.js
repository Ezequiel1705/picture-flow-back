import mongoose from "mongoose";

const publicationSchema = mongoose.Schema({
    image: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    title: {
        type: String,
        required: true,
    },
    comments : [
        {
            userId : {
                type : String,
                ref : "User"
            },
            comment : {
                type : String,
                required : true
            },
            date : Date
        }
    ],
    likes : [
        {
            userId: {
                type : String,
                ref : "User"
            }
        }
    ],
    description: {
        type: String,
        required: true,
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    tags: {
        type: [String], // Puedes ajustar según cómo quieras manejar las etiquetas
        required: true,
    },
    photographer: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al ID de un usuario (asumiendo que el usuario es almacenado en otra colección)
        ref: "User", // Nombre del modelo de usuario en caso de que esté almacenado en otra colección
        default: null,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

// Método estático para buscar publicaciones por título
publicationSchema.statics.searchByTitle = async function (title) {
    const publications = await this.find({ title: { $regex: title, $options: "i" } });
    return publications;
}


const publications = mongoose.model("Publication", publicationSchema);

export default publications;
