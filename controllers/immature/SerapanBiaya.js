import SerapanBiaya from "../../models/immature/SerapanBiayaModel.js";
import { db_app } from "../../config/Database.js";
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
        const bulan = req.body.bulan;
        const tahun = req.body.tahun;

        // Mengambil data dan mengelompokkan per kebun
        const serapanBiaya = await SerapanBiaya.findAll({
            where: {
                bulan: bulan,
                tahun: tahun
            },
            attributes: [
                'kebun',
                [sequelize.fn('SUM', sequelize.col('real_sd')), 'total_real_sd'],
                [sequelize.fn('SUM', sequelize.col('rkap_sd')), 'total_rkap_sd'],
                [sequelize.fn('SUM', sequelize.col('luas')), 'total_luas'],
                [sequelize.fn('SUM', sequelize.col('rp_ha')), 'total_rp_ha']
            ],
            group: ['kebun']
        });

        if (!serapanBiaya || serapanBiaya.length === 0) {
            return res.status(404).json({ message: "Record not found" });
        }

        // Menghitung persen_serapan untuk setiap kebun
        const rekapSerapan = serapanBiaya.map(item => {
            const totalRealSd = parseFloat(item.dataValues.total_real_sd);
            const totalRkapSd = parseFloat(item.dataValues.total_rkap_sd);

            // Menghitung persen_serapan
            const persenSerapan = totalRkapSd !== 0 ? (totalRealSd / totalRkapSd) * 100 : 0;

            return {
                kebun: item.dataValues.kebun,
                total_real_sd: totalRealSd,
                total_rkap_sd: totalRkapSd,
                persen_serapan: persenSerapan.toFixed(2), // Membulatkan ke 2 desimal
                total_luas: parseFloat(item.dataValues.total_luas),
                total_rp_ha: parseFloat(item.dataValues.total_rp_ha),
                bulan: bulan,
                tahun: tahun
                        };
        });

        rekapSerapan.sort((a, b) => a.kebun.localeCompare(b.kebun));

        res.status(200).json({
            data: rekapSerapan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getDistinctTahunBulanSerapanbiaya = async (req, res) => {
    try {
        // Query SQL untuk mengambil data distinct tahun dan bulan
        const sqlQuery = "SELECT DISTINCT tahun, bulan FROM serapan_biaya";

        // Execute the query
        const distinctTahunBulan = await db_app.query(sqlQuery, {
            type: db_app.QueryTypes.SELECT,
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