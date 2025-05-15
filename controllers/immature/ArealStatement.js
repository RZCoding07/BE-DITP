import { db_immature } from '../../config/Database.js';
import Areal from '../../models/immature/ASModel.js';

// Get all Areal records
export const getAllAreal = async (req, res) => {
    try {
        const arealRecords = await Areal.findAll();
        res.status(200).json(arealRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Areal record by ID
export const getArealById = async (req, res) => {
    try {
        const arealRecord = await Areal.findByPk(req.params.id);
        if (!arealRecord) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(arealRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Areal record
export const createAreal = async (req, res) => {
    try {
        const newRecord = await Areal.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an Areal record
export const updateAreal = async (req, res) => {
    try {
        const arealRecord = await Areal.findByPk(req.params.id);
        if (!arealRecord) return res.status(404).json({ message: "Record not found" });
        await arealRecord.update(req.body);
        res.status(200).json(arealRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an Areal record
export const deleteAreal = async (req, res) => {
    try {
        const arealRecord = await Areal.findByPk(req.params.id);
        if (!arealRecord) return res.status(404).json({ message: "Record not found" });
        await arealRecord.destroy();
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const vwCalculateAreal = async (req, res) => {
    try {
        const { bulan, tahun } = req.body;
        const arealRecords = await db_immature.query(
            `SELECT * FROM vw_calculate_tbm WHERE tahun = :tahun ORDER BY calculated_tbm ASC`,
            { replacements: { tahun }, type: db_immature.QueryTypes.SELECT }
        );
        res.status(200).json(arealRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllKebunVegetatifAreal = async (req, res) => {
    try {
        const { tahun } = req.body;
        const query = `
      SELECT 
        nama_kebun,
        kode_kebun,
        rpc,
        luasan,
        calculated_tbm
      FROM vw_areal
      WHERE tahun = :tahun AND luasan > 0
      GROUP BY rpc, kode_kebun, luasan, calculated_tbm
      ORDER BY rpc, kode_kebun, luasan, calculated_tbm
    `;
        const rows = await db_immature.query(query, {
            replacements: { tahun },
            type: db_immature.QueryTypes.SELECT
        });

        // 2. Grouping berdasarkan rpc
        const grouping = rows.reduce((acc, { calculated_tbm, rpc, kode_kebun, nama_kebun, luasan }) => {
            if (!acc[rpc]) acc[rpc] = [];
            // Menambahkan nama kebun ke dalam data
            acc[rpc].push({ kode_kebun, nama_kebun, rpc, luasan , calculated_tbm });
            return acc;
        }, {});

        // 3. Bentuk format JSON yang diinginkan
        const regionals = Object.entries(grouping).map(([name, kebuns]) => ({
            name,
            kebuns
        }));

        // 4. Kirim response
        res.json({ regionals });
    } catch (err) {
        console.error('Error fetching regional-kebun data:', err);
        res.status(500).json({ error: 'Gagal mengambil data regional-kebun' });
    }
};

export const getAllKebunVegetatifArealTbm = async (req, res) => {
    try {
        const { tahun } = req.body;
        const query = `
            SELECT 
              nama_kebun,
              kode_kebun,
              rpc,
            luasan,
              calculated_tbm
            FROM vw_areal
            WHERE tahun = :tahun 
            AND luasan > 0
            GROUP BY kode_kebun, calculated_tbm, luasan
            ORDER BY kode_kebun, calculated_tbm, luasan
    `;
        const rows = await db_immature.query(query, {
            replacements: { tahun },
            type: db_immature.QueryTypes.SELECT
        });

        // 2. Grouping berdasarkan calculated_tbm
        const grouping = rows.reduce((acc, { calculated_tbm, kode_kebun, nama_kebun, rpc, luasan }) => {
            if (!acc[calculated_tbm]) acc[calculated_tbm] = [];
            // Menambahkan nama kebun ke dalam data
            acc[calculated_tbm].push({ kode_kebun, nama_kebun, rpc, luasan, calculated_tbm });
            return acc;
        }, {});

        // 3. Bentuk format JSON yang diinginkan
        const kebuns = Object.entries(grouping).map(([name, kebuns]) => ({
            name,
            kebuns,
        }));

        res.json({ kebuns });
    } catch (err) {
        console.error('Error fetching regional-kebun data:', err);
        res.status(500).json({ error: 'Gagal mengambil data regional-kebun' });
    }
};


export const getAllArealTbm = async (req, res) => {
    try {
        const { tahun } = req.body;
        const query = `
          SELECT * FROM vw_areal WHERE tahun = 2025 
    `;
        const rows = await db_immature.query(query, {
            replacements: { tahun },
            type: db_immature.QueryTypes.SELECT
        });

        // 2. Grouping berdasarkan calculated_tbm
        const grouping = rows.reduce((acc, { calculated_tbm, kode_kebun, nama_kebun, rpc, luasan }) => {
            if (!acc[calculated_tbm]) acc[calculated_tbm] = [];
            // Menambahkan nama kebun ke dalam data
            acc[calculated_tbm].push({ kode_kebun, nama_kebun, rpc, luasan, calculated_tbm });
            return acc;
        }, {});

        // 3. Bentuk format JSON yang diinginkan
        const kebuns = Object.entries(grouping).map(([name, kebuns]) => ({
            name,
            kebuns,
        }));

        res.json({ kebuns });
    } catch (err) {
        console.error('Error fetching regional-kebun data:', err);
        res.status(500).json({ error: 'Gagal mengambil data regional-kebun' });
    }
};

export const getAllArealTbmMaster = async (req, res) => {
    try {
        const { tahun, rpc, kebun } = req.body;
        
        // Build the query with dynamic WHERE conditions
        let query = `
          SELECT * FROM vw_areal 
          WHERE tahun = :tahun AND luasan != 0 AND rpc = :rpc AND kode_kebun = :kebun
        `;
        
        // Add replacements for the query parameters
        const replacements = { tahun, rpc, kebun };

        // Execute the query with the replacements
        const rows = await db_immature.query(query, {
            replacements,
            type: db_immature.QueryTypes.SELECT
        });

        // If no data is found, return a specific message
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data areal tidak ditemukan",
            });
        }

        // Transform rows to match frontend expected structure
        const transformedRows = rows.map(row => ({
            tahun_tanam: row.tahun_tbm,
            rpc: row.rpc,
            kebun: row.kode_kebun,
            luas_ha: row.luasan,
        }));

        // Return the transformed data
        res.json({
            success: true,
            message: "Data areal berhasil diambil",
            data: transformedRows
        });
    } catch (err) {
        console.error('Error fetching areal data:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data areal',
            error: err.message
        });
    }
};