import Ckebun from "../../models/replanting/MapsModel.js";
import NodeCache from "node-cache";
import axios from "axios";
import FormData from "form-data";

// Cache configuration
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false,
});

const externalApiUrl =
  process.env.EXTERNAL_API_URL || "https://picatekpol.my.id";

// Helper function to generate cache keys
const generateCacheKey = (prefix, params) => {
  return `${prefix}_${JSON.stringify(params)}`;
};

export const getAllKordinatkebun = async (req, res) => {
  const cacheKey = "AllCkebun";

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Fetch from database if not in cache
    const ckebun = await Ckebun.findAll();
    if (!ckebun || ckebun.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    // Set to cache and respond
    cache.set(cacheKey, ckebun);
    res.status(200).json(ckebun);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchRegionals = async (req, res) => {
  const { dari_tanggal, sampai_tanggal } = req.body;
  const cacheKey = generateCacheKey("regionals", {
    dari_tanggal,
    sampai_tanggal,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("dari_tanggal", dari_tanggal);
    form.append("sampai_tanggal", sampai_tanggal);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-monev-reg`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchKebuns = async (req, res) => {
  const { region } = req.body;
  const cacheKey = generateCacheKey("kebuns", { region });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    if (!region) {
      return res.status(400).json({ message: "Regional code is required" });
    }

    // Create form-data
    const form = new FormData();
    form.append("region", region);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-monev-kebun`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAfdelings = async (req, res) => {
  const { dari_tanggal, sampai_tanggal, regional, kode_unit } = req.body;

  try {
    if (!regional || !kode_unit) {
      return res
        .status(400)
        .json({ message: "Regional code and kode unit are required" });
    }

    // Create form-data
    const form = new FormData();
    form.append("dari_tanggal", dari_tanggal);
    form.append("sampai_tanggal", sampai_tanggal);
    form.append("regional", regional);
    form.append("kode_unit", kode_unit);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-monev-afd`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchDetail = async (req, res) => {
  const { start_date, end_date } = req.body;

  try {
    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-monev-detail`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchMonitoringRegional = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  const cacheKey = generateCacheKey("monitoring_regional", {
    start_date,
    end_date,
    region,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-regional`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchMonitoringUnit = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  const cacheKey = generateCacheKey("monitoring_unit", {
    start_date,
    end_date,
    region,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);
    form.append("region", region);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-unit`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchMonitoringAfdeling = async (req, res) => {
  const { start_date, end_date, region, kode_unit } = req.body;
  const cacheKey = generateCacheKey("monitoring_afdeling", {
    start_date,
    end_date,
    region,
    kode_unit,
  });
  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);
    form.append("region", region);
    form.append("kode_unit", kode_unit);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-afdeling`,
      form,
      { headers: form.getHeaders() }
    );
    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: error.response?.data || "No additional error details",
    });
  }
};

export const fetchCorrectiveActionRegional = async (req, res) => {
  const { start_date, end_date } = req.body;
  const cacheKey = generateCacheKey("corrective_action", {
    start_date,
    end_date,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-ca-region`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchCorrectiveActionKebun = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  const cacheKey = generateCacheKey("corrective_action", {
    start_date,
    end_date,
    region,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);
    form.append("region", region);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-ca-unit`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const fetchRekapBlokTU = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  const cacheKey = generateCacheKey("rekap_blok_tu", {
    start_date,
    end_date,
    region,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);
    form.append("region", region);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-blok-tu`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchCorrectiveActionAfdeling = async (req, res) => {
  const { start_date, end_date, region, kode_unit } = req.body;
  const cacheKey = generateCacheKey("corrective_action", {
    start_date,
    end_date,
    region,
    kode_unit,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);
    form.append("region", region);
    form.append("kode_unit", kode_unit);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-ca-afdeling`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// d-monev-delete-detail

export const fetchDeleteMonevDetail = async (req, res) => {
  const { monev_id } = req.body;

  try {
    if (!monev_id) {
      return res.status(400).json({ message: "Monev ID is required" });
    }

    // Create form-data
    const form = new FormData();
    form.append("monev_id", monev_id);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-monev-delete-detail`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchDetailMonevDetail = async (req, res) => {
  const { id } = req.params;
  
  // Validasi input
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'ID harus berupa angka' });
  }

  try {
    // Konfigurasi headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'QYsMhk5oo7KhtW4nrSpo3h51EEJZnDNtj5ss18Ex',
      // Tambahkan header CORS jika diperlukan
      'Access-Control-Allow-Origin': '*'
    };

    // Gunakan GET request jika endpoint memang GET
    const response = await axios.get(
      `https://ess.ptpn4.co.id/api/v1/monitoring-evaluasi/${id}/show`,
      { headers }
    );

    // Handle response
    const responseData = response.data?.data || response.data;
    
    // Tambahkan header CORS di response proxy Anda
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.status(200).json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Error fetching detail:', error);
    
    // Handle error response dari API eksternal
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage
    });
  }
};



export const fetchDetailBelumMonev = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'QYsMhk5oo7KhtW4nrSpo3h51EEJZnDNtj5ss18Ex',
      'Access-Control-Allow-Origin': '*'
    };

    // POST request untuk ambil seluruh data karyawan belum monev
    const response = await axios.post(
      `https://ess.ptpn4.co.id/api/v1/d-rekap-karyawan-belum-monev`,
      {
        start_date,
        end_date,
        region
      },
      { headers }
    );

    const list = response.data?.data || [];

    // Cari data berdasarkan SAP (ID)
    const found = list.find((item) => item.sap === id);

    if (!found) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    // Hanya kembalikan field yang diperlukan
    const filtered = {
      sap: found.sap,
      name: found.name,
      desc_personnel_area: found.desc_personnel_area,
      personnel_subarea: found.personnel_subarea,
      desc_personnel_subarea: found.desc_personnel_subarea,
      org_unit: found.org_unit,
      desc_org_unit: found.desc_org_unit,
      employee_group: found.employee_group,
      desc_employee_group: found.desc_employee_group,
      position: found.position,
      desc_position: found.desc_position,
      job: found.job,
      desc_job: found.desc_job,
      level: found.level,
      work_start_date: found.work_start_date,
      phdp_gol: found.phdp_gol,
      person_grade: found.person_grade,
      region: found.region,
      subregion: found.subregion,
    };

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    return res.status(200).json({ success: true, data: filtered });

  } catch (error) {
    console.error('Error fetching data:', error);
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    return res.status(statusCode).json({ success: false, message: errorMessage });
  }
};

export const fetchJobPosition = async (req, res) => {
  const { start_date, end_date, region, kode_unit, afdeling, blok } = req.body;
  const cacheKey = generateCacheKey("job_position", {
    start_date,
    end_date,
    region,
    kode_unit,
    afdeling,
    blok,
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);
    if (region) form.append("region", region);
    if (kode_unit) form.append("kode_unit", kode_unit);
    if (afdeling) form.append("afdeling", afdeling);
    if (blok) form.append("blok", blok);

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/api/d-rekap-jabatan`,
      form,
      { headers: form.getHeaders() }
    );

    const responseData = response.data?.data || response.data;
    cache.set(cacheKey, responseData);
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: error.response?.data || "No additional error details",
    });
  }
};

export const clearCache = async (req, res) => {
  try {
    const { pattern } = req.query;

    if (pattern) {
      const keys = cache.keys();
      const matchingKeys = keys.filter((key) => key.includes(pattern));
      matchingKeys.forEach((key) => cache.del(key));

      res.status(200).json({
        message: `Cleared ${matchingKeys.length} cache entries`,
        clearedKeys: matchingKeys,
      });
    } else {
      cache.flushAll();
      res.status(200).json({ message: "All cache cleared" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCacheStats = async (req, res) => {
  try {
    const stats = cache.getStats();
    const keys = cache.keys();

    res.status(200).json({
      ...stats,
      totalKeys: keys.length,
      keys: keys,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchRekapKaryawanBelumMonev = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  const cacheKey = generateCacheKey("rekap_karyawan_belum_monev", {
    start_date,
    end_date,
    region,
  });

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const form = new FormData();
    form.append("start_date", start_date);
    form.append("end_date", end_date);
    form.append("region", region);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'QYsMhk5oo7KhtW4nrSpo3h51EEJZnDNtj5ss18Ex',
      'Access-Control-Allow-Origin': '*'
    };

    // POST request untuk ambil seluruh data karyawan belum monev
    const response = await axios.post(
      `https://ess.ptpn4.co.id/api/v1/d-rekap-karyawan-belum-monev`,
      {
        start_date,
        end_date,
        region
      },
      { headers }
    );

    const responseData = response.data?.data || response.data;

    // Normalize desc_org_unit berdasarkan desc_cost_center
    const processedData = responseData.map((item) => {
      const afdNumber = extractAfdFromCostCenter(item.desc_cost_center);
      const afdFormatted = afdNumber ? `AFD${afdNumber.toString().padStart(2, '0')}` : item.desc_org_unit;
      
      return {
        ...item,
        desc_org_unit: afdFormatted,
      };
    });

    cache.set(cacheKey, processedData);
    res.status(200).json(processedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mengekstrak nomor AFD dari desc_cost_center
function extractAfdFromCostCenter(costCenterDesc) {
  if (!costCenterDesc) return null;
  
  // Mencocokkan pola seperti "AFD 01", "AFD 02", dll
  const afdRegex = /AFD\s*(\d{2})/i;
  const match = costCenterDesc.match(afdRegex);
  
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return null;
}

// --- AFD Normalization Utilities ---

function normalizeAfd(entry) {
  const afdRegex = `/AFDELING\s+([IVXLCDM]+|\d+)(?:\s+|$)/i`;
  const afdShortRegex = `/AFD\s*[- ]\s*([IVXLCDM]+|\d+)(?:\s+|$)/i`;

  const match = entry.match(afdRegex) || entry.match(afdShortRegex);
  if (match) {
    const number = match[1];
    let num;
    if (/^[IVXLCDM]+$/i.test(number)) {
      num = romanToInt(number.toUpperCase());
    } else {
      num = parseInt(number, 10);
    }

    if (!isNaN(num)) {
      return `AFD${num.toString().padStart(2, '0')}`;
    }
  }

  return null;
}

function romanToInt(roman) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let previous = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const current = values[roman[i]];
    total += current < previous ? -current : current;
    previous = current;
  }

  return total;
}