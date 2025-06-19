import SerapanBiaya from "../../models/immature/SerapanBiayaModel.js";
import { db_immature } from "../../config/Database.js";
import sequelize from "sequelize";

// Get all SerapanBiaya records
export const getAllSerapanBiaya = async (req, res) => {
    try {
        const serapanBiaya = await SerapanBiaya.findAll();
        res.status(200).json(serapanBiaya);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single SerapanBiaya record by ID
export const getSerapanBiayaById = async (req, res) => {
    try {
        const serapanBiaya = await SerapanBiaya.findByPk(req.params.id);
        if (!serapanBiaya) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(serapanBiaya);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSerapanBiayaByBulanTahun = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || !req.body.bulan || !req.body.tahun) {
            return res.status(400).json({ 
                message: "Bad request - bulan and tahun are required in the request body" 
            });
        }

        const bulan = req.body.bulan;
        const tahun = req.body.tahun;

        console.log(`Fetching data for bulan: ${bulan}, tahun: ${tahun}`);

        // Validate bulan and tahun values
        if (isNaN(bulan) || isNaN(tahun)) {
            return res.status(400).json({ 
                message: "bulan and tahun must be numeric values" 
            });
        }

        // Prepare replacements object
        const replacements = { 
            bulan: parseInt(bulan), 
            tahun: parseInt(tahun) 
        };

        console.log('Replacements:', replacements);

        // Execute query
        const serapanBiaya = await db_immature.query(`
            SELECT * from vw_serapan_biaya
            where bulan = :bulan AND tahun = :tahun
        `, {
            replacements: replacements,
            type: db_immature.QueryTypes.SELECT
        });

        console.log(`Found ${serapanBiaya.length} records`);



        // Return successful response
        res.status(200).json({
            success: true,
            message: `Data retrieved successfully for bulan ${bulan} tahun ${tahun}`,
            data: serapanBiaya,
            metadata: {
                count: serapanBiaya.length,
                bulan: bulan,
                tahun: tahun
            }
        });

    } catch (error) {
        console.error('Error in getSerapanBiayaByBulanTahun:', error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getDistinctTahunBulanSerapanbiaya = async (req, res) => {
    try {
        // Query SQL untuk mengambil data distinct tahun dan bulan
        const sqlQuery = "SELECT DISTINCT tahun, bulan FROM serapan_biaya";

        // Execute the query
        const distinctTahunBulan = await db_immature.query(sqlQuery, {
            type: db_immature.QueryTypes.SELECT,
        });

        // Kirim data sebagai response
        return res.status(200).json(distinctTahunBulan);
    } catch (error) {
        console.error("Error fetching distinct tahun and bulan:", error);
        return res.status(500).json({
            message: "Failed to fetch data. Please try again later.",
        });
    }
};


// Create a new SerapanBiaya record
export const createSerapanBiaya = async (req, res) => {
    try {
        const newRecord = await SerapanBiaya.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a SerapanBiaya record
export const updateSerapanBiaya = async (req, res) => {
    try {
        const serapanBiaya = await SerapanBiaya.findByPk(req.params.id);
        if (!serapanBiaya) return res.status(404).json({ message: "Record not found" });
        await serapanBiaya.update(req.body);
        res.status(200).json(serapanBiaya);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a SerapanBiaya record
export const deleteSerapanBiaya = async (req, res) => {
    try {
        const serapanBiaya = await SerapanBiaya.findByPk(req.params.id);
        if (!serapanBiaya) return res.status(404).json({ message: "Record not found" });
        await serapanBiaya.destroy();
        res.status(200).json({ message: "Record deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get SerapanBiaya records by regional
export const getSerapanBiayaByRegional = async (req, res) => {
    try {
        const serapanBiaya = await SerapanBiaya.findAll({
            where: {
                regional: req.params.regional
            }
        });
        res.status(200).json(serapanBiaya);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getDistinctKebunSerapanBiayaWhereBulanTahun = async (req, res) => {
    try {
        const serapanBiaya = await SerapanBiaya.findAll({
            attributes: ['kebun'],
            where: {
                bulan: req.params.bulan,
                tahun: req.params.tahun
            },
            group: ['kebun']
        });
        res.status(200).json(serapanBiaya);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const getDistinctTahunBulanSerapanBiaya = async (req, res) => {
    try {
        const serapanBiaya = await SerapanBiaya.findAll({
            attributes: ['tahun', 'bulan'],
            group: ['tahun', 'bulan']
        });
        res.status(200).json(serapanBiaya);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}