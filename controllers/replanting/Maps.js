import Ckebun from '../../models/replanting/MapsModel.js';
import NodeCache from 'node-cache';
import axios from 'axios';
import FormData from 'form-data';

// Cache configuration
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

const externalApiUrl = process.env.EXTERNAL_API_URL || "https://picatekpol.my.id";

// Helper function to generate cache keys
const generateCacheKey = (prefix, params) => {
  return `${prefix}_${JSON.stringify(params)}`;
};

export const getAllKordinatkebun = async (req, res) => {   
  const cacheKey = 'AllCkebun';
  
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
}

export const fetchRegionals = async (req, res) => {
  const { dari_tanggal, sampai_tanggal } = req.body;
  const cacheKey = generateCacheKey('regionals', { dari_tanggal, sampai_tanggal });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append('dari_tanggal', dari_tanggal);
    form.append('sampai_tanggal', sampai_tanggal);

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
  const { region  } = req.body;
  const cacheKey = generateCacheKey('kebuns', { region });

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
    form.append('region', region);

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
      return res.status(400).json({ message: "Regional code and kode unit are required" });
    }

    // Create form-data
    const form = new FormData();
    form.append('dari_tanggal', dari_tanggal);
    form.append('sampai_tanggal', sampai_tanggal);
    form.append('regional', regional);
    form.append('kode_unit', kode_unit);

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

export const fetchMonitoringUnit = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  const cacheKey = generateCacheKey('monitoring_unit', { start_date, end_date, region });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append('start_date', start_date);
    form.append('end_date', end_date);
    form.append('region', region);

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

export const fetchCorrectiveAction = async (req, res) => {
  const { start_date, end_date, region } = req.body;
  const cacheKey = generateCacheKey('corrective_action', { start_date, end_date, region });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append('start_date', start_date);
    form.append('end_date', end_date);
    form.append('region', region);

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

export const fetchJobPosition = async (req, res) => {
  const { start_date, end_date, region, kode_unit, afdeling, blok } = req.body;
  const cacheKey = generateCacheKey('job_position', { 
    start_date, 
    end_date, 
    region, 
    kode_unit, 
    afdeling, 
    blok 
  });

  try {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Create form-data
    const form = new FormData();
    form.append('start_date', start_date);
    form.append('end_date', end_date);
    if (region) form.append('region', region);
    if (kode_unit) form.append('kode_unit', kode_unit);
    if (afdeling) form.append('afdeling', afdeling);
    if (blok) form.append('blok', blok);

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
      details: error.response?.data || 'No additional error details' 
    });
  }
};


export const clearCache = async (req, res) => {
  try {
    const { pattern } = req.query;
    
    if (pattern) {
      const keys = cache.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      matchingKeys.forEach(key => cache.del(key));
      
      res.status(200).json({
        message: `Cleared ${matchingKeys.length} cache entries`,
        clearedKeys: matchingKeys
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
      keys: keys
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};