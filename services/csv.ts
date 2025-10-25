import type { IpRight, Rule } from '../types';

/**
 * Handles complex values for CSV export. Stringifies objects/arrays.
 */
const processValueForExport = (value: any): string => {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
};

/**
 * Exports an array of objects to a CSV file and triggers a download.
 * @param filename - The name of the file to be downloaded.
 * @param data - The array of objects to export.
 */
export function exportToCsv(filename: string, data: any[]): void {
    if (data.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => 
            headers.map(fieldName => {
                const value = processValueForExport(row[fieldName]);
                // Escape quotes by doubling them and wrap the whole value in quotes
                // to handle commas, quotes, and newlines within the value.
                const escaped = value.replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',')
        )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Parses a string that might be JSON. Returns original string if not valid JSON.
 */
const parsePotentiallyJsonString = (value: string): any => {
    try {
        // Only try to parse if it looks like an object or array
        if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
             return JSON.parse(value);
        }
    } catch (e) {
        // Not a valid JSON string, return as is
    }
    return value;
}

/**
 * A more robust CSV row parser that handles quoted fields containing commas.
 * @param rowString - A single line from a CSV file.
 * @returns An array of strings representing the cells in the row.
 */
function parseCsvRow(rowString: string): string[] {
    const values: string[] = [];
    let currentVal = '';
    let inQuotes = false;
    for (let i = 0; i < rowString.length; i++) {
        const char = rowString[i];

        if (char === '"') {
            if (inQuotes && rowString[i + 1] === '"') {
                // This is an escaped quote
                currentVal += '"';
                i++; // Skip the next quote
            } else {
                // This is a starting or ending quote
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(currentVal);
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    values.push(currentVal); // Add the last value
    return values;
}


/**
 * Imports and parses a CSV file into an array of objects.
 * @param file - The CSV file object from a file input.
 * @returns A promise that resolves to an array of parsed objects.
 */
export function importFromCsv<T>(file: File): Promise<T[]> {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file provided."));
        }
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            return reject(new Error("Invalid file type. Please upload a .csv file."));
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) {
                return reject(new Error("File is empty or could not be read."));
            }
            
            // Normalize line endings and filter out empty lines
            const lines = text.replace(/\r\n/g, '\n').split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) {
                return reject(new Error("CSV must have a header row and at least one data row."));
            }
            
            const header = lines[0].trim().split(',');
            const data: T[] = [];

            for (let i = 1; i < lines.length; i++) {
                const values = parseCsvRow(lines[i].trim());

                if (values.length !== header.length) {
                    console.warn(`Skipping malformed row ${i + 1}: Expected ${header.length} columns, but got ${values.length}`);
                    continue;
                }
                const obj: any = {};
                header.forEach((key, index) => {
                    const value = values[index];
                    obj[key] = parsePotentiallyJsonString(value);
                });
                data.push(obj as T);
            }
            resolve(data);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}
