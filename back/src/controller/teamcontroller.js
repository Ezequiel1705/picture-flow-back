import TeamModel from "../models/team.js"

export const getTeams = async (req, res) => {
    try {

        const teams = await TeamModel.find();

        if(!teams.length) return res.status(404).json({error : 'No hay ningun equipo disponible'});

        return res.status(200).json(teams);

    } catch {
        console.log(error);
        return res.status(500).json({ error : "Error interno del servidor"});
    }
}

export const updateTeam = async (req, res) => {
    const { id } = req.params;
    const { teamName, teamImage } = req.body

    const toUpdate ={
        teamName,
        teamImage
    }

    const updatedUser = await TeamModel.findByIdAndUpdate(
        id,
        toUpdate,
        { new: true } // Devuelve el documento actualizado
    );
        

    return res.status(200).json(updatedUser);

}


export const postTeam = async (req, res) => {

    const { teamName, teamImage } = req.body

    try {
        const newTeam = new TeamModel({teamName, teamImage});
        await newTeam.save(newTeam);
        return res.status(200).json(newTeam);

    } catch {
        console.log(error);
        return res.status(500).json({ error : "Error interno del servidor"});
    }
}