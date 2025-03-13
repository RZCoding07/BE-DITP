import { db_app } from '../../config/Database.js';
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
        const why = await db_app.query('SELECT * FROM vw_pi', { type: db_app.QueryTypes.SELECT });


    
        
        // Simpan hasil query ke cache
        cache.set('AllWhy', why);

        res.status(200).json(why);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

