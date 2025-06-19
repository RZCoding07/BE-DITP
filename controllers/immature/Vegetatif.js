import Vegetatif from '../../models/immature/VegetatifModel.js';
import { db_immature } from '../../config/Database.js';

// Get all Vegetatif records
export const getAllVegetatif = async (req, res) => {
    try {
        const { regional, kebun } = req.body;

        let query;
        let replacements = [];

        // Jika tidak ada regional dan kebun, tampilkan semua data
        if (!regional && !kebun) {
            query = `SELECT * FROM vw_vegetatif ORDER BY bulan DESC, tahun DESC`;
            replacements = [];
        } else if (!kebun || kebun === "") {
            // Buat query dengan IN clause untuk semua kebun di regional tersebut
            query = `SELECT * FROM vw_vegetatif WHERE regional = ? ORDER BY bulan DESC, tahun DESC`;
            replacements = [regional];
        } else {
            // Jika kebun diisi, query seperti biasa
            query = `SELECT * FROM vw_vegetatif WHERE regional = ? AND kebun = ? ORDER BY bulan DESC, tahun DESC`;
            replacements = [regional, kebun];
        }

        const vegetatif = await db_immature.query(query, {
            replacements: replacements,
            type: db_immature.QueryTypes.SELECT
        });

        res.status(200).json(vegetatif);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getVegetatifByBulanTahun = async (req, res) => {
    try {
        const { bulan, tahun } = req.params;

        // Query ke database
        const vegetatif = await Vegetatif.findAll({
            where: {
                bulan: bulan,
                tahun: tahun
            }
        });

        if (!vegetatif) return res.status(404).json({ message: "Record not found" });

        res.status(200).json(vegetatif);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single Vegetatif record by ID
export const getVegetatifById = async (req, res) => {
    try {
        const { id } = req.params;

        // Ambil data dari database
        const vegetatif = await Vegetatif.findByPk(id);
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

export const bulkDeleteVegetatif = async (req, res) => {
    try {
        const { ids } = req.body;
        console.log('IDs to delete:', ids);

        if (!Array.isArray(ids) || !ids.length) {
            return res.status(400).json({ message: "Invalid or empty IDs array" });
        }

        // Find all records matching the provided IDs
        const vegetatifs = await Vegetatif.findAll({
            where: {
                id: ids
            }
        });

        // Debugging log to check what records were found
        console.log('Requested IDs:', ids);
        console.log('Found Vegetatifs:', vegetatifs.map(v => v.id));

        // If some records were not found
        if (vegetatifs.length !== ids.length) {
            const notFoundIds = ids.filter(id => !vegetatifs.some(v => v.id === id));
            return res.status(404).json({ message: `The following records were not found: ${notFoundIds.join(', ')}` });
        }

        // Delete all the records
        await Vegetatif.destroy({
            where: {
                id: ids
            }
        });

        res.status(200).json({
            message: `${vegetatifs.length} records deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to fetch distinct 'tahun' and 'bulan' from the 'vegetatif' table
export const getDistinctTahunBulanVegetatif = async (req, res) => {
    try {
        // Query SQL untuk mengambil data distinct tahun dan bulan
        const sqlQuery = "SELECT DISTINCT tahun FROM vegetatif  ORDER BY tahun DESC"

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

export const getDistinctBulanVegetatif = async (req, res) => {
    try {
        const { tahun } = req.body; // Ambil tahun dari parameter URL
        // Query SQL untuk mengambil data distinct bulan berdasarkan tahun
        const sqlQuery = "SELECT DISTINCT bulan FROM vegetatif WHERE tahun = :tahun ORDER BY bulan DESC"

        // Execute the query
        const distinctBulan = await db_immature.query(sqlQuery, {
            replacements: { tahun },
            type: db_immature.QueryTypes.SELECT,
        });

        // Kirim data sebagai response
        return res.status(200).json(distinctBulan);
    } catch (error) {
        console.error("Error fetching distinct bulan:", error);
        return res.status(500).json({
            message: "Failed to fetch data. Please try again later.",
        });
    }
};

export const getKebunWhereRegVegetatif = async (req, res) => {
    try {
        // SQL query untuk mengambil distinct kebun berdasarkan regional
        const sqlQuery = "SELECT DISTINCT kebun FROM vegetatif WHERE regional = :regional ORDER BY kebun ASC";

        // Execute the query
        const distinctKebun = await db_immature.query(sqlQuery, {
            replacements: { regional: req.body.rpc },
            type: db_immature.QueryTypes.SELECT,
        });

        return res.status(200).json(distinctKebun);
    } catch (error) {
        console.error("Error fetching distinct kebun:", error);
        return res.status(500).json({
            message: "Failed to fetch data. Please try again later.",
        });
    }
};

export const getAfdWhereKebunVegetatif = async (req, res) => {
    try {
        // SQL query untuk mengambil distinct afdeling berdasarkan regional dan kebun
        const sqlQuery = "SELECT DISTINCT afdeling FROM vegetatif WHERE regional = :regional AND kebun = :kebun ORDER BY afdeling ASC";

        // Execute the query
        const distinctAfd = await db_immature.query(sqlQuery, {
            replacements: { regional: req.body.rpc, kebun: req.body.kebun },
            type: db_immature.QueryTypes.SELECT,
        });

        return res.status(200).json(distinctAfd);
    } catch (error) {
        console.error("Error fetching distinct afdeling:", error);
        return res.status(500).json({
            message: "Failed to fetch data. Please try again later.",
        });
    }
};

function interpolate(x, xp, yp) {
    const validData = [];
    for (let i = 0; i < xp.length; i++) {
        if (yp[i] !== null && yp[i] !== undefined && !isNaN(yp[i])) {
            validData.push({
                x: xp[i],
                y: yp[i]
            });
        }
    }
    if (validData.length === 0) {
        return x.map(() => null);
    }
    validData.sort((a, b) => a.x - b.x);
    const cleanXp = validData.map(item => item.x);
    const cleanYp = validData.map(item => item.y);
    return x.map(xi => {
        if (xi <= cleanXp[0]) return cleanYp[0];
        if (xi >= cleanXp[cleanXp.length - 1]) return cleanYp[cleanXp.length - 1];
        let i = 0;
        while (i < cleanXp.length && cleanXp[i] < xi) i++;
        if (i === 0 || i === cleanXp.length) return null;
        const x0 = cleanXp[i - 1];
        const x1 = cleanXp[i];
        const y0 = cleanYp[i - 1];
        const y1 = cleanYp[i];
        return y0 + (y1 - y0) * (xi - x0) / (x1 - x0);
    });
}

export const getRulesOfStandarisasiVegetatif = async (req, res) => {
    try {
        const x_values = [6, 12, 18, 24, 30];
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
        const idx = parseInt(req.query.idx) || 1; // Default to dataset 1 if not specified

        if (idx < 1 || idx > datasets.length) {
            return res.status(400).json({ error: "Invalid dataset index" });
        }

        const selectedDataset = datasets[idx - 1];

        // Generate full range of months (1-36)
        const x_full = Array.from({ length: 36 }, (_, i) => i + 1);

        // Process all required indices (0, 1, 8)
        const tinggiTanaman = interpolate(x_full, [1, ...x_values], [21, ...selectedDataset[0]]);
        const jumlahPelepah = interpolate(x_full, [1, ...x_values], [18, ...selectedDataset[1]]);
        const lingkarBatang = interpolate(x_full, [1, ...x_values], [48.5, ...selectedDataset[8]]);

        // Create response array
        const response = x_full.map(umur => {
            // Determine fase based on age
            let fase;
            if (umur <= 12) fase = "TBM I";
            else if (umur <= 24) fase = "TBM II";
            else fase = "TBM III";

            // Helper functions for formatting
            const formatRange = (value, baseValue) => {
                const rounded = Math.round(value);
                return {
                    skor100: rounded,
                    skor90: rounded - 1,
                    skor80: rounded - 2
                };
            };

            const formatLingkarBatang = (value) => {
                const rounded = Math.round(value);
                return {
                    skor100: `>= ${rounded + 5}`,
                    skor90: `${rounded} - ${rounded + 4}`,
                    skor80: `< ${rounded}`.replace('\u003C', '<') // Ensure proper < character
                };
            };

            const formatTinggiTanaman = (value) => {
                const rounded = Math.round(value);
                return {
                    skor100: `>= ${rounded}`,
                    skor90: `${rounded - 2} - ${rounded - 1}`,
                    skor80: `< ${rounded - 2}`.replace('\u003C', '<') // Ensure proper < character
                };
            };

            const formatKerapatanPokok = (value) => {
                const rounded = Math.round(value);
                return {
                    skor100: `${rounded} - ${rounded + 3}`,
                    skor90: `${rounded - 10} - ${rounded - 1}`,
                    skor80: `< ${rounded - 10}`.replace('\u003C', '<') // Ensure proper < character
                };
            };

            return {
                fase,
                umur,
                lingkarBatang: formatLingkarBatang(lingkarBatang[umur - 1]),
                jumlahPelepah: formatRange(jumlahPelepah[umur - 1], 18),
                tinggiTanaman: formatTinggiTanaman(tinggiTanaman[umur - 1])
            };
        });

        // Convert response to string and replace any escaped characters
        const responseString = JSON.stringify(response, null, 2).replace(/\\u003C/g, '<');

        // Send as proper JSON
        res.setHeader('Content-Type', 'application/json');
        return res.send(responseString);
    } catch (error) {
        console.error("Error in getRulesOfStandarisasiVegetatif:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const callProcVegetatif = async (req, res) => {
    try {
        const {
            input_bulan,
            input_tahun,
        } = req.body;

        const query = `
        SELECT * FROM vw_final_vegetatif
        WHERE 
          vw_final_vegetatif.bulan = :bulan AND
          vw_final_vegetatif.tahun = :tahun
      `;

        const results = await db_immature.query(query, {
            replacements: {
                bulan: input_bulan,
                tahun: input_tahun,
            },
            type: db_immature.QueryTypes.SELECT,
        });

        res.json({
            success: true,
            data: results,
            source: 'database',
        });
    } catch (error) {
        console.error('Error executing procedure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to execute procedure',
            error: error.message,
        });
    }
};

export const getVwVegetatifById = async (req, res) => {
    try {
        const id = req.body.id
        const vegetatif = await db_immature.query(`SELECT * FROM vw_vegetatif WHERE id = "${id}"`, {
            type: db_immature.QueryTypes.SELECT,
        });
        if (!vegetatif) return res.status(404).json({ message: "Record not found" });

        res.status(200).json(vegetatif);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllVegetatifProgress = async (req, res) => {
    try {
        const { tahun } = req.params; // Ambil tahun dari parameter URL

        // Query ke database untuk mendapatkan data vegetatif berdasarkan tahun
        const vegetatif = await db_immature.query(
            `SELECT * FROM vw_vegetatif_progress WHERE Tahun = :tahun`,
            {
                replacements: { tahun },
                type: db_immature.QueryTypes.SELECT,
            }
        );

        if (!vegetatif || vegetatif.length === 0) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json(vegetatif);
    } catch (error) {
        console.error('Error in getAllVegetatifProgress:', error);
        res.status(500).json({ message: error.message });
    }
}