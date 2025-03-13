import BaseTBM from '../../models/immature/BaseTBMModel.js';

// Get all BaseTBM records
export const getAllBaseTBM = async (req, res) => {
    try {
        const baseTBM = await BaseTBM.findAll();
        res.status(200).json(baseTBM);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single BaseTBM record by ID
export const getBaseTBMById = async (req, res) => {
    try {
        const baseTBM = await BaseTBM.findByPk(req.params.id);
        if (!baseTBM) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(baseTBM);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new BaseTBM record
export const createBaseTBM = async (req, res) => {
    try {
        const newRecord = await BaseTBM.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a BaseTBM record
export const updateBaseTBM = async (req, res) => {
    try {
        const baseTBM = await BaseTBM.findByPk(req.params.id);
        if (!baseTBM) return res.status(404).json({ message: "Record not found" });
        await baseTBM.update(req.body);
        res.status(200).json(baseTBM);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a BaseTBM record
export const deleteBaseTBM = async (req, res) => {
    try {
        const baseTBM = await BaseTBM.findByPk(req.params.id);
        if (!baseTBM) return res.status(404).json({ message: "Record not found" });
        await baseTBM.destroy();
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
