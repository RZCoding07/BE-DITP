import { db_immature } from '../../config/Database.js';
import W from '../../models/immature/PiModel.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getAllWhy = async (req, res) => {
    try {
        // Cek apakah data ada di cache
        const cachedData = cache.get('AllWhy');
        if (cachedData) {
            console.log("Cache hit for AllWhy");
            return res.status(200).json(cachedData);
        }

        // Ambil data dari database jika tidak ada di cache
        const why = await db_immature.query('SELECT * FROM vw_pi', { type: db_immature.QueryTypes.SELECT });


    
        
        // Simpan hasil query ke cache
        cache.set('AllWhy', why);

        res.status(200).json(why);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPi = async (req, res) => {
    try {
      const { w1, w2, w3, measurement } = req.body
  
      // Create a new instance of the Pi model
      const newPi = await W.create({
        w1,
        w2,
        w3,
        measurement,
      })
  
      // Send a success response
      res.status(201).json({ message: 'Data successfully saved', data: newPi })
    } catch (error) {
      console.error('Error creating PI:', error)
      res.status(500).json({ message: 'An error occurred while saving data', error: error.message })
    }
  }


export const getPiById = async (req, res) => {
    const { id } = req.body;
    try {
        // Cek apakah data ada di cache
        const cachedData = cache.get(`Pi-${id}`);
        if (cachedData) {
            console.log("Cache hit for Pi-" + id);
            return res.status(200).json(cachedData);
        }

        // Ambil data dari database jika tidak ada di cache
        const pi = await W.findOne({ where: { id: id } });

        // Simpan hasil query ke cache
        cache.set(`Pi-${id}`, pi);

        res.status(200).json(pi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deletePiById = async (req, res) => {
    const { id } = req.body;
    try {
        const pi = await W.destroy({ where: { id: id } });
        if (pi) {
            // Hapus data dari cache
            cache.del(`Pi-${id}`);
            res.status(200).json({ message: "Data deleted successfully" });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const updatePiById = async (req, res) => {
    const { id } = req.params;
    const { w1, w2, w3, measurement, approval, status } = req.body;
    try {
        const pi = await W.findOne({ where: { id: id } });
        if (pi) {
            pi.w1 = w1 || pi.w1;
            pi.w2 = w2 || pi.w2;
            pi.w3 = w3 || pi.w3;
            pi.measurement = measurement || pi.measurement;
            pi.approval = approval || pi.approval;
            pi.status = status || pi.status;

            await pi.save();

            // Hapus data dari cache
            cache.del(`Pi-${id}`);

            res.status(200).json(pi);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

