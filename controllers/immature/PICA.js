import PiCa from "../../models/immature/PiCaModel.js"
import { db_immature } from "../../config/Database.js";
export const submitPiCa = async (req, res) => {
    try {
        const {
            why1, why2, why3, value_pi, blok, vegetatif_id, correctiveActions, keterangan,
            created_by, update_by, bulan, tahun,
            regional, kebun, afdeling, tahun_tanam
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
            corrective_actions: correctiveActions || [],
            created_by: created_by || req.user?.fullname || "system",
            updated_by: update_by || req.user?.fullname || "system",
            regional: regional || "Unknown",
            kebun: kebun || "Unknown",
            afdeling: afdeling || "Unknown",
            tahun_tanam: tahun_tanam || new Date().getFullYear().toString(),
        };

        // Cek apakah data sudah ada berdasarkan unique key (misal: vegetatif_id + blok + bulan + tahun)
        const existingRecord = await PiCa.findOne({
            where: {
                vegetatif_id,
                blok,
                bulan,
                tahun,
            }
        });

        if (existingRecord) {
            // Update data jika sudah ada
            await existingRecord.update(piData);

            return res.status(200).json({
                success: true,
                message: "Data updated successfully",
                id: existingRecord.id,
            });
        } else {
            // Create data baru kalau belum ada
            const newRecord = await PiCa.create(piData);

            return res.status(201).json({
                success: true,
                message: "Data created successfully",
                id: newRecord.id,
            });
        }

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
        const piCa = await db_immature.query('SELECT * FROM vw_pica', { type: db_immature.QueryTypes.SELECT });
        res.status(200).json(piCa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getAllPiCaCursor = async (req, res) => {
  try {
    // Get parameters from query
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      sortBy = "max_progress_percentage", 
      sortOrder = "DESC",
      regional = "",
      kebun = ""
    } = req.query;
    
    const parsedPage = Number.parseInt(page);
    const parsedLimit = Number.parseInt(limit);

    // Validate parameters
    if (isNaN(parsedPage) || parsedPage <= 0) {
      return res.status(400).json({
        message: "Invalid page parameter. It must be a positive number.",
      });
    }

    if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100000) {
      return res.status(400).json({
        message: "Invalid limit parameter. It must be a number between 1 and 100.",
      });
    }

    // Calculate offset
    const offset = (parsedPage - 1) * parsedLimit;

    // Build the count query to get total rows
    let countQuery = "SELECT COUNT(*) as total FROM vw_final_pica";
    const countReplacements = {};
    const countWhereClauses = [];

    if (search) {
      countWhereClauses.push(`(
        regional LIKE :search 
        OR kebun LIKE :search 
        OR afdeling LIKE :search 
        OR blok LIKE :search 
        OR keterangan LIKE :search
        OR why1 LIKE :search
        OR why2 LIKE :search
        OR why3 LIKE :search
      )`);
      countReplacements.search = `%${search}%`;
    }

    if (regional) {
      countWhereClauses.push("regional = :regional");
      countReplacements.regional = regional;
    }

    if (kebun) {
      countWhereClauses.push("kebun = :kebun");
      countReplacements.kebun = kebun;
    }

    if (countWhereClauses.length > 0) {
      countQuery += " WHERE " + countWhereClauses.join(" AND ");
    }

    // Execute count query
    const countResult = await db_immature.query(countQuery, {
    replacements: countReplacements,
    type: db_immature.QueryTypes.SELECT,
    });

    const totalRows = countResult[0].total;

    // QUERY 1: Ambil data tanpa corrective_actions untuk sorting
    let dataQuery = `
      SELECT 
        id, regional, kebun, afdeling, tahun_tanam, pica_vegetatif_id,
        why1, why2, why3, blok, value_pi, keterangan,
        created_by, updated_by, bulan, tahun, createdAt, updatedAt,
        project_id, max_progress_percentage,
        vegetatif_id, vegetatif_regional, vegetatif_kebun, vegetatif_afdeling,
        vegetatif_bulan_tanam, vegetatif_blok, vegetatif_tahun_tanam,
        vegetatif_varietas, vegetatif_luas_ha, vegetatif_jumlah_pokok_awal_tanam,
        vegetatif_jumlah_pokok_sekarang, vegetatif_umur_saat_ini_bulan,
        vegetatif_jumlah_anak_daun, vegetatif_tinggi_tanaman_cm,
        vegetatif_jumlah_pelepah_bh, vegetatif_panjang_rachis_cm,
        vegetatif_lebar_petiola_cm, vegetatif_tebal_petiola_cm,
        vegetatif_rerata_panjang_anak_daun, vegetatif_rerata_lebar_anak_daun,
        vegetatif_lingkar_batang_cm, vegetatif_tahun, vegetatif_bulan,
        vegetatif_status, vegetatif_approval, vegetatif_cal_jumlah_pelepah,
        vegetatif_cal_lingkar_batang, vegetatif_cal_tinggi_tanaman,
        vegetatif_vw_fase_tbm
      FROM vw_final_pica
    `;
    
    const dataReplacements = {
      limit: parsedLimit,
      offset: offset,
    };

    const dataWhereClauses = [];

    if (search) {
      dataWhereClauses.push(`(
        regional LIKE :search 
        OR kebun LIKE :search 
        OR afdeling LIKE :search 
        OR blok LIKE :search 
        OR keterangan LIKE :search
        OR why1 LIKE :search
        OR why2 LIKE :search
        OR why3 LIKE :search
      )`);
      dataReplacements.search = `%${search}%`;
    }

    if (regional) {
      dataWhereClauses.push("regional = :regional");
      dataReplacements.regional = regional;
    }

    if (kebun) {
      dataWhereClauses.push("kebun = :kebun");
      dataReplacements.kebun = kebun;
    }

    if (dataWhereClauses.length > 0) {
      dataQuery += " WHERE " + dataWhereClauses.join(" AND ");
    }

    // Tambahkan sorting jika diperlukan
    const validSortColumns = ['max_progress_percentage', 'regional', 'kebun', 'afdeling', 'blok', 'value_pi'];
    const validSortOrder = ['ASC', 'DESC'];
    
    if (validSortColumns.includes(sortBy) && validSortOrder.includes(sortOrder.toUpperCase())) {
      dataQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    dataQuery += " LIMIT :limit OFFSET :offset";

    // Execute data query tanpa corrective_actions
    const piCaWithoutActions = await db_immature.query(dataQuery, {
      replacements: dataReplacements,
      type: db_immature.QueryTypes.SELECT,
    });

    // QUERY 2: Ambil hanya corrective_actions untuk ID yang sudah difilter
    if (piCaWithoutActions.length > 0) {
      const ids = piCaWithoutActions.map(item => item.id);
      
      const actionsQuery = `
        SELECT id, corrective_actions 
        FROM vw_final_pica 
        WHERE id IN (:ids)
      `;
      
      const actionsResult = await db_immature.query(actionsQuery, {
        replacements: { ids },
        type: db_immature.QueryTypes.SELECT,
      });

      // Gabungkan hasil kedua query
      const piCa = piCaWithoutActions.map(item => {
        const actionItem = actionsResult.find(a => a.id === item.id);
        return {
          ...item,
          corrective_actions: actionItem ? actionItem.corrective_actions : null
        };
      });

      // Calculate total pages
      const totalPages = Math.ceil(totalRows / parsedLimit);

      res.status(200).json({
        data: piCa,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalRows: totalRows,
          totalPages: totalPages,
          searchTerm: search || null,
          filters: {
            regional: regional || null,
            kebun: kebun || null
          }
        },
      });
    } else {
      res.status(200).json({
        data: [],
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalRows: totalRows,
          totalPages: Math.ceil(totalRows / parsedLimit),
          searchTerm: search || null,
          filters: {
            regional: regional || null,
            kebun: kebun || null
          }
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPiCaWithoutCorrectiveActions = async (req, res) => {
  try {
    // Get parameters from query
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      sortBy = "max_progress_percentage", 
      sortOrder = "DESC",
      regional = "",
      kebun = ""
    } = req.query;
    
    const parsedPage = Number.parseInt(page);
    const parsedLimit = Number.parseInt(limit);

    // Validate parameters
    if (isNaN(parsedPage) || parsedPage <= 0) {
      return res.status(400).json({
        message: "Invalid page parameter. It must be a positive number.",
      });
    }

    if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100000) {
      return res.status(400).json({
        message: "Invalid limit parameter. It must be a number between 1 and 100.",
      });
    }

    // Calculate offset
    const offset = (parsedPage - 1) * parsedLimit;

    // Build the count query to get total rows
    let countQuery = "SELECT COUNT(*) as total FROM vw_final_pica";
    const countReplacements = {};
    const countWhereClauses = ["(corrective_actions IS NULL OR corrective_actions = '[]')"];

    if (search) {
      countWhereClauses.push(`(
        regional LIKE :search 
        OR kebun LIKE :search 
        OR afdeling LIKE :search 
        OR blok LIKE :search 
        OR keterangan LIKE :search
        OR why1 LIKE :search
        OR why2 LIKE :search
        OR why3 LIKE :search
      )`);
      countReplacements.search = `%${search}%`;
    }

    if (regional) {
      countWhereClauses.push("regional = :regional");
      countReplacements.regional = regional;
    }

    if (kebun) {
      countWhereClauses.push("kebun = :kebun");
      countReplacements.kebun = kebun;
    }

    countQuery += " WHERE " + countWhereClauses.join(" AND ");

    // Execute count query
    const countResult = await db_immature.query(countQuery, {
      replacements: countReplacements,
      type: db_immature.QueryTypes.SELECT,
    });

    const totalRows = countResult[0].total;

    // QUERY 1: Ambil data tanpa corrective_actions untuk sorting
    let dataQuery = `
      SELECT 
        id, regional, kebun, afdeling, tahun_tanam, pica_vegetatif_id,
        why1, why2, why3, blok, value_pi, keterangan,
        created_by, updated_by, bulan, tahun, createdAt, updatedAt,
        project_id, max_progress_percentage,
        vegetatif_id, vegetatif_regional, vegetatif_kebun, vegetatif_afdeling,
        vegetatif_bulan_tanam, vegetatif_blok, vegetatif_tahun_tanam,
        vegetatif_varietas, vegetatif_luas_ha, vegetatif_jumlah_pokok_awal_tanam,
        vegetatif_jumlah_pokok_sekarang, vegetatif_umur_saat_ini_bulan,
        vegetatif_jumlah_anak_daun, vegetatif_tinggi_tanaman_cm,
        vegetatif_jumlah_pelepah_bh, vegetatif_panjang_rachis_cm,
        vegetatif_lebar_petiola_cm, vegetatif_tebal_petiola_cm,
        vegetatif_rerata_panjang_anak_daun, vegetatif_rerata_lebar_anak_daun,
        vegetatif_lingkar_batang_cm, vegetatif_tahun, vegetatif_bulan,
        vegetatif_status, vegetatif_approval, vegetatif_cal_jumlah_pelepah,
        vegetatif_cal_lingkar_batang, vegetatif_cal_tinggi_tanaman,
        vegetatif_vw_fase_tbm
      FROM vw_final_pica
      WHERE (corrective_actions IS NULL OR corrective_actions = '[]')
    `;
    
    const dataReplacements = {
      limit: parsedLimit,
      offset: offset,
    };

    const dataWhereClauses = [];

    if (search) {
      dataWhereClauses.push(`(
        regional LIKE :search 
        OR kebun LIKE :search 
        OR afdeling LIKE :search 
        OR blok LIKE :search 
        OR keterangan LIKE :search
        OR why1 LIKE :search
        OR why2 LIKE :search
        OR why3 LIKE :search
      )`);
      dataReplacements.search = `%${search}%`;
    }

    if (regional) {
      dataWhereClauses.push("regional = :regional");
      dataReplacements.regional = regional;
    }

    if (kebun) {
      dataWhereClauses.push("kebun = :kebun");
      dataReplacements.kebun = kebun;
    }

    if (dataWhereClauses.length > 0) {
      dataQuery += " AND " + dataWhereClauses.join(" AND ");
    }

    // Tambahkan sorting jika diperlukan
    const validSortColumns = ['max_progress_percentage', 'regional', 'kebun', 'afdeling', 'blok', 'value_pi'];
    const validSortOrder = ['ASC', 'DESC'];
    
    if (validSortColumns.includes(sortBy) && validSortOrder.includes(sortOrder.toUpperCase())) {
      dataQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    dataQuery += " LIMIT :limit OFFSET :offset";

    // Execute data query
    const piCaWithoutActions = await db_immature.query(dataQuery, {
      replacements: dataReplacements,
      type: db_immature.QueryTypes.SELECT,
    });

    // Since we're only selecting records without corrective_actions, we don't need the second query
    const piCa = piCaWithoutActions.map(item => ({
      ...item,
      corrective_actions: null // or [] if you prefer
    }));

    // Calculate total pages
    const totalPages = Math.ceil(totalRows / parsedLimit);

    res.status(200).json({
      data: piCa,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalRows: totalRows,
        totalPages: totalPages,
        searchTerm: search || null,
        filters: {
          regional: regional || null,
          kebun: kebun || null
        }
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const picaw3Count = async (req, res) => {
    try {
        // Extract filter parameters from query string
        const { regional, kebun, afdeling } = req.query;
        
        // Start building the query and parameters
        let query = `
            SELECT 
                why3, 
                COUNT(*) AS count 
            FROM 
                vw_pica 
        `;
        
        const whereClauses = [];
        const replacements = {};
        
        // Add filters if they exist in the query parameters
        if (regional) {
            whereClauses.push('regional = :regional');
            replacements.regional = regional;
        }
        
        if (kebun) {
            whereClauses.push('kebun = :kebun');
            replacements.kebun = kebun;
        }
        
        if (afdeling) {
            whereClauses.push('afdeling = :afdeling');
            replacements.afdeling = afdeling;
        }
        
        // Add WHERE clause if there are any filters
        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }
        
        // Add GROUP BY clause
        query += ' GROUP BY why3';
        
        // Execute the query with replacements
        const result = await db_immature.query(query, {
            replacements,
            type: db_immature.QueryTypes.SELECT
        });
        
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message || "Internal server error",
        });
    }
};


export const getVwFinalPica = async (req, res) => {
    try {
    const { bulan, tahun } = req.body;

        // Start building the query and parameters
        let query = `
            SELECT 
                pica_vegetatif_id,
                why3
            FROM 
                vw_final_pica 
            WHERE 
                bulan = :bulan AND 
                tahun = :tahun
        `;  
        const replacements = { bulan, tahun };
        // Add filters if they exist in the query parameters
        if (!bulan || !tahun) {
            return res.status(400).json({
                success: false,
                message: "Bulan and Tahun are required parameters"
            });
        }

        // Execute the query with replacements
        const result = await db_immature.query(query, {
            replacements,
            type: db_immature.QueryTypes.SELECT
        });
        // If no data is found, return a specific message
        if (!result || result.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No data found"
            });
        }
        // Return the result
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching final PICA data:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Internal server error",
        });
    }
};


