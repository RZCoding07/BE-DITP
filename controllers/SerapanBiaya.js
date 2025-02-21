import SerapanBiaya from "../models/SerapanBiayaModel.js";

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