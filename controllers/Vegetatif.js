import Vegetatif from '../models/VegetatifModel.js';

// Get all Vegetatif records
export const getAllVegetatif = async (req, res) => {
    try {
        const vegetatif = await Vegetatif.findAll();
        res.status(200).json(vegetatif);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Vegetatif record by ID
export const getVegetatifById = async (req, res) => {
    try {
        const vegetatif = await Vegetatif.findByPk(req.params.id);
        if (!vegetatif) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(vegetatif);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Vegetatif record
export const createVegetatif = async (req, res) => {
    try {
        const newRecord = await Vegetatif.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a Vegetatif record
export const updateVegetatif = async (req, res) => {
    try {
        const vegetatif = await Vegetatif.findByPk(req.params.id);
        if (!vegetatif) return res.status(404).json({ message: "Record not found" });
        await vegetatif.update(req.body);
        res.status(200).json(vegetatif);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Vegetatif record
export const deleteVegetatif = async (req, res) => {
    try {
        const vegetatif = await Vegetatif.findByPk(req.params.id);
        if (!vegetatif) return res.status(404).json({ message: "Record not found" });
        await vegetatif.destroy();
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDistinctTahunBulanVegetatif = async (req, res) => {
    try {
        const vegetatif = await Vegetatif.findAll({
            attributes: [
                'tahun', 
                'bulan'
            ],
            group: ['tahun', 'bulan'], // Kelompokkan berdasarkan tahun dan bulan
            order: [
                ['tahun', 'ASC'],
                ['bulan', 'ASC']
            ]
        });
        res.status(200).json(vegetatif);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
