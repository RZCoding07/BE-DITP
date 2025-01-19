import { db_app } from '../config/Database.js';
import NodeCache from 'node-cache';


const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getAllWhy = async (req, res) => {
    try {
        const key = 'why';
        let why = cache.get(key);
        if (!why) {
            const sqlQuery = "SELECT * FROM vw_pi";

            db_app.query(sqlQuery, (
                err,
                result
            ) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    why = result;
                    cache.set(key, why);
                    res.status(200).json(why);
                }
            }
            );
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
