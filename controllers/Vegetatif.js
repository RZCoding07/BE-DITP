import Vegetatif from '../models/VegetatifModel.js';
import { db_app } from '../config/Database.js';

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
        const distinctTahunBulan = await db_app.query("SELECT DISTINCT tahun, bulan FROM vegetatif", { type: db_app.QueryTypes.SELECT });
        res.status(200).json(distinctTahunBulan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


function interpolate(x, xp, yp) {
    return x.map(xi => {
      if (xi <= xp[0]) return yp[0];
      if (xi >= xp[xp.length - 1]) return yp[yp.length - 1];
  
      let i = 0;
      while (xp[i] < xi) i++;
  
      const x0 = xp[i - 1];
      const x1 = xp[i];
      const y0 = yp[i - 1];
      const y1 = yp[i];
  
      return y0 + (y1 - y0) * (xi - x0) / (x1 - x0);
    });
  }
  
  


export const getRulesOfStandarisasiVegetatif = async (req, res) => {

    const datasets = [
        [
            [29.7, 69.7, 96.7, 134.2, 167.0],
            [20.7, 36.8, 40.0, 39.6, 56.0],
            [130.4, 218.9, 280.8, 319.8, 463.9],
            [2.3, 4.0, 4.1, 4.5, 5.3],
            [1.6, 2.9, 2.4, 2.7, 3.4],
            [56.7, 78.8, 102.0, 123.1, 124.0],
            [32.1, 56.5, 66.3, 72.7, 86.2],
            [3.0, 3.7, 3.5, 4.0, 4.5],
            [116.51, 150.0, 192.5, 235.0, 277.50]
        ],
        [
            [32.0, 64.0, 98.9, 133.2, 173.0],
            [18.9, 36.1, 39.7, 37.6, 52.0],
            [155.6, 220.5, 282.9, 342.9, 486.9],
            [2.5, 3.3, 4.2, 4.4, 5.1],
            [1.7, 2.3, 2.5, 2.5, 3.3],
            [55.0, 77.2, 96.0, 109.5, 119.0],
            [37.7, 54.9, 63.7, 76.5, 80.9],
            [3.4, 3.5, 3.8, 4.1, 4.5],
            [116.51, 150.0, 192.5, 235.0, 277.50]
        ],
        [
            [36.1, 65.9, 95.4, 134.5, 164.0],
            [23.3, 34.6, 40.2, 40.5, 52.0],
            [142.1, 208.3, 280.8, 337.0, 456.1],
            [2.3, 3.4, 4.2, 4.3, 5.0],
            [1.4, 2.4, 2.6, 3.1, 2.9],
            [60.2, 73.9, 96.4, 119.4, 123.0],
            [3.9, 55.0, 69.5, 74.2, 82.1],
            [2.8, 3.3, 3.6, 4.1, 4.1],
            [116.51, 150.0, 192.5, 235.0, 277.50]
        ],
        [
            [36.1, 65.9, 95.4, 134.5, 164.0],
            [23.3, 34.6, 40.2, 40.5, 52.0],
            [148, 182.5, , 252.5, 289.5],
            [2.3, 3.4, 4.2, 4.3, 5.0],
            [1.4, 2.4, 2.6, 3.1, 2.9],
            [60.2, 73.9, 96.4, 119.4, 123.0],
            [3.9, 55.0, 69.5, 74.2, 82.1],
            [2.8, 3.3, 3.6, 4.1, 4.3],
            [116.51, 150.0, 192.5, 235.0, 277.50]
        ],
        [
            [29.7, 69.7, 96.7, 134.2, 167.0],
            [20.7, 36.8, 40.0, 39.6, 56.0],
            [140, 190, 240, 285, 340],
            [2.3, 4.0, 4.1, 4.5, 5.3],
            [1.6, 2.9, 2.4, 2.7, 3.4],
            [56.7, 78.8, 102.0, 123.1, 124.0],
            [32.1, 56.5, 66.3, 72.7, 86.2],
            [3.0, 3.7, 3.5, 4.0, 4.5],
            [116.51, 150.0, 192.5, 235.0, 277.50]
        ]

    ];

    const y_column_index = parseInt(req.query.y_column_index);
    const idx = parseInt(req.query.idx);
  
    if (idx < 1 || idx > datasets.length) {
      return res.status(400).json({ error: "Invalid dataset index" });
    }
  
    const data = datasets[idx - 1];
    const y_values = data[y_column_index];
  
    if (Array.isArray(y_values[0])) {
      return res.status(400).json({ error: `Dataset ${idx}: Contains nested data, interpolation skipped.` });
    }
  
    const x_full = Array.from({ length: 30 }, (_, i) => i + 1);
    const x_values_modified = [1, ...x_values];
    const y_values_modified = [19, ...y_values];
  
    const y_full = interpolate(x_full, x_values_modified, y_values_modified);
  
    const result = Object.fromEntries(x_full.map((x, i) => [x, Number(y_full[i].toFixed(2))]));
  
    return res.json(result);
}