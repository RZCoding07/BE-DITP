import Ckebun from "../../models/replanting/MapsModel.js"
import NodeCache from "node-cache"
import axios from "axios"

// Cache configuration
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false,
})

const externalApiUrl = "https://ess.ptpn4.co.id/api/v1"

// Standard headers for all API calls
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: "QYsMhk5oo7KhtW4nrSpo3h51EEJZnDNtj5ss18Ex",
  "Access-Control-Allow-Origin": "*",
})

// Helper function to generate cache keys
const generateCacheKey = (prefix, params) => {
  return `${prefix}_${JSON.stringify(params)}`
}

export const getAllKordinatkebun = async (req, res) => {
  const cacheKey = "AllCkebun"

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from database if not in cache
    const ckebun = await Ckebun.findAll()

    if (!ckebun || ckebun.length === 0) {
      return res.status(404).json({ message: "No records found" })
    }

    // Set to cache and respond
    cache.set(cacheKey, ckebun)
    res.status(200).json(ckebun)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchRegionals = async (req, res) => {
  const { dari_tanggal, sampai_tanggal } = req.body
  const cacheKey = generateCacheKey("regionals", {
    dari_tanggal,
    sampai_tanggal,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-monev-reg`,
      {
        dari_tanggal,
        sampai_tanggal,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchKebuns = async (req, res) => {
  const { region } = req.body
  const cacheKey = generateCacheKey("kebuns", { region: region || "all" })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Prepare request body
    const requestBody = {}
    if (region) {
      requestBody.region = region
    }

    // Fetch from external API
    const response = await axios.post(`${externalApiUrl}/d-monev-kebun`, requestBody, { headers: getHeaders() })

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchAfdelings = async (req, res) => {
  const { dari_tanggal, sampai_tanggal, regional, kode_unit } = req.body

  try {
    if (!regional || !kode_unit) {
      return res.status(400).json({ message: "Regional code and kode unit are required" })
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-monev-afd`,
      {
        dari_tanggal,
        sampai_tanggal,
        regional,
        kode_unit,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchDetail = async (req, res) => {
  const { start_date, end_date } = req.body

  try {
    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-monev-detail`,
      {
        start_date,
        end_date,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchMonitoringPalmco = async (req, res) => {
  const { start_date, end_date } = req.body
  const cacheKey = generateCacheKey("monitoring_palmco", {
    start_date,
    end_date,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-palmco`,
      {
        start_date,
        end_date,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchMonitoringRegional = async (req, res) => {
  const { start_date, end_date, region } = req.body
  const cacheKey = generateCacheKey("monitoring_regional", {
    start_date,
    end_date,
    region,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-regional`,
      {
        start_date,
        end_date,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchMonitoringUnit = async (req, res) => {
  const { start_date, end_date, region } = req.body
  const cacheKey = generateCacheKey("monitoring_unit", {
    start_date,
    end_date,
    region,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-unit`,
      {
        start_date,
        end_date,
        region,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchMonitoringAfdeling = async (req, res) => {
  const { start_date, end_date, region, kode_unit } = req.body
  const cacheKey = generateCacheKey("monitoring_afdeling", {
    start_date,
    end_date,
    region,
    kode_unit,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-afdeling`,
      {
        start_date,
        end_date,
        region,
        kode_unit,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: error.response?.data || "No additional error details",
    })
  }
}

export const fetchCorrectiveActionRegional = async (req, res) => {
  const { start_date, end_date } = req.body
  const cacheKey = generateCacheKey("corrective_action", {
    start_date,
    end_date,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-ca-blok`,
      {
        start_date,
        end_date,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchCorrectiveActionKebun = async (req, res) => {
  const { start_date, end_date, region } = req.body
  const cacheKey = generateCacheKey("corrective_action", {
    start_date,
    end_date,
    region,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-ca-blok`,
      {
        start_date,
        end_date,
        region,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchRekapBlokTU = async (req, res) => {
  const { start_date, end_date, region } = req.body
  const cacheKey = generateCacheKey("rekap_blok_tu", {
    start_date,
    end_date,
    region,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-blok-tu`,
      {
        start_date,
        end_date,
        region,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchCorrectiveActionAfdeling = async (req, res) => {
  const { start_date, end_date, region, kode_unit } = req.body
  const cacheKey = generateCacheKey("corrective_action_afdeling", {
    start_date,
    end_date,
    region,
    kode_unit,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-ca-afdeling`,
      {
        start_date,
        end_date,
        region,
        kode_unit,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchDeleteMonevDetail = async (req, res) => {
  const { monev_id } = req.body

  try {
    if (!monev_id) {
      return res.status(400).json({ message: "Monev ID is required" })
    }

    // Fetch from external API
    const response = await axios.post(
      `${externalApiUrl}/d-monev-delete-detail`,
      {
        monev_id,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchDetailMonevDetail = async (req, res) => {
  const { id } = req.params

  // Validasi input
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "ID harus berupa angka" })
  }

  try {
    // Gunakan GET request
    const response = await axios.get(`${externalApiUrl}/monitoring-evaluasi/${id}/show`, { headers: getHeaders() })

    // Handle response
    const responseData = response.data?.data || response.data

    // Tambahkan header CORS di response proxy Anda
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET")
    res.status(200).json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Error fetching detail:", error)

    // Handle error response dari API eksternal
    const statusCode = error.response?.status || 500
    const errorMessage = error.response?.data?.message || error.message

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    })
  }
}

export const fetchDetailBelumMonev = async (req, res) => {
  const { start_date, end_date, region, id } = req.body

  try {
    // POST request untuk ambil seluruh data karyawan belum monev
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-karyawan-belum-monev`,
      {
        start_date,
        end_date,
        region,
      },
      { headers: getHeaders() },
    )

    const list = response.data?.data || []

    // Cari data berdasarkan SAP (ID)
    const found = list.find((item) => item.sap === id)

    if (!found) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" })
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
    }

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "POST")
    return res.status(200).json({ success: true, data: filtered })
  } catch (error) {
    console.error("Error fetching data:", error)
    const statusCode = error.response?.status || 500
    const errorMessage = error.response?.data?.message || error.message
    return res.status(statusCode).json({ success: false, message: errorMessage })
  }
}

export const fetchJobPosition = async (req, res) => {
  const { start_date, end_date, region, kode_unit, afdeling, blok } = req.body
  const cacheKey = generateCacheKey("job_position", {
    start_date,
    end_date,
    region,
    kode_unit,
    afdeling,
    blok,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // Prepare request body
    const requestBody = {
      start_date,
      end_date,
    }

    if (region) requestBody.region = region
    if (kode_unit) requestBody.kode_unit = kode_unit
    if (afdeling) requestBody.afdeling = afdeling
    if (blok) requestBody.blok = blok

    // Fetch from external API
    const response = await axios.post(`${externalApiUrl}/d-rekap-jabatan`, requestBody, { headers: getHeaders() })

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({
      message: error.message,
      details: error.response?.data || "No additional error details",
    })
  }
}

export const clearCache = async (req, res) => {
  try {
    const { pattern } = req.query

    if (pattern) {
      const keys = cache.keys()
      const matchingKeys = keys.filter((key) => key.includes(pattern))
      matchingKeys.forEach((key) => cache.del(key))

      res.status(200).json({
        message: `Cleared ${matchingKeys.length} cache entries`,
        clearedKeys: matchingKeys,
      })
    } else {
      cache.flushAll()
      res.status(200).json({ message: "All cache cleared" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCacheStats = async (req, res) => {
  try {
    const stats = cache.getStats()
    const keys = cache.keys()

    res.status(200).json({
      ...stats,
      totalKeys: keys.length,
      keys: keys,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const fetchRekapKaryawanBelumMonev = async (req, res) => {
  const { start_date, end_date, region } = req.body
  const cacheKey = generateCacheKey("rekap_karyawan_belum_monev", {
    start_date,
    end_date,
    region,
  })

  try {
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // POST request untuk ambil seluruh data karyawan belum monev
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-karyawan-belum-monev`,
      {
        start_date,
        end_date,
        region,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data

    // Normalize desc_org_unit
    const processedData = responseData.map((item) => {
      // First try to extract AFD from cost center
      const afdFromCostCenter = extractAfdFromCostCenter(item.desc_cost_center)

      if (afdFromCostCenter) {
        return {
          ...item,
          desc_org_unit: `AFD${afdFromCostCenter.toString().padStart(2, "0")}`,
        }
      }

      // If not found in cost center, try to normalize the org unit description
      const normalizedAfd = normalizeAfd(item.desc_org_unit)

      if (normalizedAfd) {
        return {
          ...item,
          desc_org_unit: normalizedAfd,
        }
      }

      // If no normalization possible, return original
      return item
    })

    cache.set(cacheKey, processedData)
    res.status(200).json(processedData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Fungsi untuk mengekstrak nomor AFD dari desc_cost_center
function extractAfdFromCostCenter(costCenterDesc) {
  if (!costCenterDesc) return null

  // Mencocokkan pola seperti "AFD 01", "AFD 02", dll
  const afdRegex = /AFD\s*(\d{2})/i
  const match = costCenterDesc.match(afdRegex)

  if (match && match[1]) {
    return Number.parseInt(match[1], 10)
  }

  return null
}

// Normalize AFD description from org unit
function normalizeAfd(desc) {
  if (!desc) return null

  const afdRegex = /(?:AFDELING|AFD)[\s-]*([IVXLCDM]+|\d+)/i
  const match = desc.match(afdRegex)

  if (match && match[1]) {
    const number = match[1]
    let num

    // Check if roman numeral
    if (/^[IVXLCDM]+$/i.test(number)) {
      num = romanToInt(number.toUpperCase())
    } else {
      num = Number.parseInt(number, 10)
    }

    if (!isNaN(num)) {
      return `AFD${num.toString().padStart(2, "0")}`
    }
  }

  return null
}

function romanToInt(roman) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  let previous = 0

  for (let i = roman.length - 1; i >= 0; i--) {
    const current = values[roman[i]]
    total += current < previous ? -current : current
    previous = current
  }

  return total
}

export const fetchMonev = async (req, res) => {
  const { start_date, end_date, region, kode_unit, afdeling } = req.body
  const cacheKey = generateCacheKey("monev", {
    start_date,
    end_date,
    region,
    kode_unit,
    afdeling,
  })

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    // POST request untuk ambil data monev
    const response = await axios.post(
      `${externalApiUrl}/d-rekap-blok-tu`,
      {
        start_date,
        end_date,
        region,
        kode_unit,
        afdeling,
      },
      { headers: getHeaders() },
    )

    const responseData = response.data?.data || response.data
    cache.set(cacheKey, responseData)
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
