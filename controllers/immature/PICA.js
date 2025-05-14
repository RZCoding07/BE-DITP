import PiCa from "../../models/immature/PiCaModel.js"
import { db_immature } from "../../config/Database.js";

export const submitPiCa = async (req, res) => {
    try {
        // Extract form data
        const { id, why1, why2, why3, value_pi, blok, vegetatif_id, correctiveActions, keterangan, 
        created_by, update_by,
        bulan, tahun
    } = req.body;

        const piData = {
            why1,
            why2,
            why3,
            value_pi,
            vegetatif_id,
            blok,
            keterangan,
            bulan,
            tahun,
            corrective_actions: correctiveActions || [], // Assuming this is an array of corrective actions
            created_by,
            updated_by: req.user?.fullname || "system",
        };

        // Check if we're updating or creating

        // Create new record
        const newRecord = await PiCa.create({
            ...piData,
            regional: req.body.regional || "Unknown",
            kebun: req.body.kebun || "Unknown",
            afdeling: req.body.afdeling || "Unknown",
            tahun_tanam: req.body.tahun_tanam || new Date().getFullYear().toString(),
            created_by: req.body.created_by || req.user?.fullname || "system",
        });

        return res.status(201).json({
            success: true,
            message: "Data created successfully",
            id: newRecord.id,
        });

    } catch (error) {
        console.error("Error submitting PI and CA data:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Internal server error",
        });
    }
};

export const getAllPiCa = async (req, res) => {
    try {
        const piCa = await db_immature.query('SELECT * FROM pica', { type: db_immature.QueryTypes.SELECT });
        res.status(200).json(piCa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const picaw3Count = async (req, res) => {
    try {
    const query = `
        SELECT 
            why3, 
            COUNT(*) AS count 
        FROM 
            pica 
        GROUP BY 
            why3
    `;

        const result = await db_immature.query(query, { type: db_immature.QueryTypes.SELECT });
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message || "Internal server error",
        });
    }
};