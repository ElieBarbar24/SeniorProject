import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }


  excelToArray(file: File): Promise<Array<Record<string, any>>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      // Event handler for when the FileReader successfully loads the file content
      reader.onload = (event: any) => {
        try {
          const data = event.target.result;
  
          // Parse the Excel data using the XLSX library
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
  
          // Check if the sheet and range are defined
          if (sheet && sheet['!ref']) {
            // Decode the range of cells in the sheet
            const range = XLSX.utils.decode_range(sheet['!ref']);
  
            // Initialize an array to store the result
            var result: Array<Record<string, any>> = [];
  
            // Iterate through each row in the range
            for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
              const row: Record<string, any> = {};
  
              // Flag to check if the row is entirely empty
              let isRowEmpty = true;
  
              // Iterate through each column in the range
              for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
                // Get the cell address and value
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
                const cellValue = sheet[cellAddress]?.v;
  
                if (cellValue !== undefined && cellValue !== null && cellValue !== '') {
                  // If any cell in the row is not empty, set the flag to false
                  isRowEmpty = false;
  
                  if (rowIndex === 0) {
                    // If it's the header row, use the cell value as the key
                    row[cellValue] = cellValue;
                  } else {
                    // For data rows, use the key from the header row for the current cell
                    const key = Object.keys(result[0])[colIndex];
                    row[key] = cellValue;
                  }
                }
              }
  
              // If the row is not entirely empty, add it to the result
              if (!isRowEmpty) {
                result.push(row);
              }
            }
  
            // Resolve the promise with the result
            resolve(result);
          } else {
            console.error('Sheet or range is undefined.');
          }
        } catch (error) {
          // Reject the promise if an error occurs
          reject(error);
        }
      };
  
      // Event handler for FileReader errors
      reader.onerror = (error) => {
        reject(error);
      };
  
      // Read the Excel file content as binary string
      reader.readAsBinaryString(file);
    });
  }
  
}
