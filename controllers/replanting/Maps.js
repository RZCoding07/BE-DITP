import Ckebun from '../../models/replanting/MapsModel.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getAllCkebun = async (req, res) => {   
    try {
        const cachedData = cache.get('AllCkebun');
        if (cachedData) {
            console.log("Cache hit for AllCkebun");
            return res.status(200).json(cachedData);
        }

        const ckebun = await Ckebun.findAll();
        if (!ckebun) return res.status(404).json({ message: "Record not found" });


        cache.set('AllCkebun', ckebun);

        res.status(200).json(ckebun);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}