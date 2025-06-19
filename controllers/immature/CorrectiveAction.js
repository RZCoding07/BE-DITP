import { db_immature } from '../../config/Database.js';
import Ca from '../../models/immature/CaModel.js';
import NodeCache from 'node-cache';


const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getAllCa = async (req, res) => {
    try {
        // Cek apakah data ada di cache
        const cachedData = cache.get('AllCa');
        if (cachedData) {
            console.log("Cache hit for AllCa");
            return res.status(200).json(cachedData);
        }

        // Ambil data dari database jika tidak ada di cache
        const why = await db_immature.query('SELECT * FROM vw_ca', { type: db_immature.QueryTypes.SELECT });


    
        
        // Simpan hasil query ke cache
        cache.set('AllCa', why);

        res.status(200).json(why);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const createCa = async (req, res) => {
    try {
        const { w1, w2, w3, ca, measurement } = req.body;
        
        const newCa = await Ca.create({
            w1,
            w2,
            w3,
            ca,
            measurement
        });
        
        res.status(201).json({
            message: "Data created successfully",
            data: newCa
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating data",
            error: error.message
        });
    }
};