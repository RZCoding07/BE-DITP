import { db_app } from '../config/Database.js';
import NodeCache from 'node-cache';


const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getAllWhy = async (req, res) => {
    try {
        const key = 'why';
        let why = cache.get(key);

        if (why) {
            return res.status(200).json(why);
        }

        const sqlQuery = "SELECT * FROM vw_pi";

        const result = await db_app.query(sqlQuery);

        cache.set(key, result);

        res.status(200).json(result);

    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};
