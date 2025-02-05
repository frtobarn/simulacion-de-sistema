// utils/dataParser.js
import Papa from 'papaparse';

export async function loadCSVData(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            download: true,
            header: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (err) => reject(err),
        });
    });
}
