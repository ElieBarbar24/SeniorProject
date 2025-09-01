import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  arrayToExcel(d: any, fileName: string) {
    // Create a new workbook
    var data: any[] = d.schedule;
    var statistics: any[] = d.statistics;
    const workbook = XLSX.utils.book_new();

    // Convert data array to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scheduel');

    const statisticsWorksheet = XLSX.utils.json_to_sheet(statistics);

    // Add the statistics worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, statisticsWorksheet, 'Statistics');

    //Adjust column widths
    const columnWidths = [];
    for (const key in data[0]) {
      const columnLength = data.reduce((acc, curr) => {
        const value = curr[key] ? curr[key].toString().length : 0;
        return Math.max(acc, value);
      }, key.length);
      columnWidths.push({ wch: columnLength + 2 }); // Add some extra padding
    }
    worksheet['!cols'] = columnWidths;

    // Add borders to data cells
    // Add borders to data cells
    if (worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: R };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          if (!worksheet[cellRef]) continue;
          worksheet[cellRef].s = {
            border: {
              top: { style: 'thin', color: { auto: 1 } },
              bottom: { style: 'thin', color: { auto: 1 } },
              left: { style: 'thin', color: { auto: 1 } },
              right: { style: 'thin', color: { auto: 1 } }
            }
          };
        }
      }
    }

    // Hide the last 4 columns of the data worksheet
    const lastColumnIndex = worksheet['!cols'].length - 1;
    for (let i = lastColumnIndex; i > lastColumnIndex - 6; i--) {
      worksheet['!cols'][i].hidden = true;
    }
    const columnWidthsStatistics = [];
    for (const key in statistics[0]) {
      const columnLength = statistics.reduce((acc, curr) => {
        const value = curr[key] ? curr[key].toString().length : 0;
        return Math.max(acc, value);
      }, key.length);
      columnWidthsStatistics.push({ wch: columnLength + 2 }); // Add some extra padding
    }
    statisticsWorksheet['!cols'] = columnWidthsStatistics;

    // Add borders to data cells of the statistics worksheet
    if (statisticsWorksheet['!ref']) {
      const range = XLSX.utils.decode_range(statisticsWorksheet['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: R };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          if (!statisticsWorksheet[cellRef]) continue;
          statisticsWorksheet[cellRef].s = {
            border: {
              top: { style: 'thin', color: { auto: 1 } },
              bottom: { style: 'thin', color: { auto: 1 } },
              left: { style: 'thin', color: { auto: 1 } },
              right: { style: 'thin', color: { auto: 1 } }
            }
          };
        }
      }
    }
    
    if (statisticsWorksheet['!ref']) {
      const range = XLSX.utils.decode_range(statisticsWorksheet['!ref']);
      var iter = 2;
      for (let R = range.s.r+1; R <= range.e.r; ++R) {
        
        const cellAddress = { c: 1, r: R }; // Assuming column A (index 1) contains the criteria for the COUNTIF formula
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const criterion = statisticsWorksheet[cellRef] ? statisticsWorksheet[cellRef].v : null;
        // if (criterion) {
        //   const formula = `=COUNTIF(Scheduel!J2:J1048576, "*" & INDIRECT("A${iter}") & "*")`;
        //   // const formula = `=COUNTIF(Scheduel!J2:J100, "*" & INDIRECT(A${criterion}) & "*")`;
        //   const formulaCellAddress = { c: 1, r: R }; // Assuming the formula will be written in column B (index 1)
        //   const formulaCellRef = XLSX.utils.encode_cell(formulaCellAddress);
        //   statisticsWorksheet[formulaCellRef] = { f: formula };
        // }

        if (criterion) {
          // Formula for column J
          const formulaJ = `=COUNTIF(Scheduel!J2:J1048576, "*" & INDIRECT("A${iter}") & "*")`;
          const formulaCellAddressJ = { c: 1, r: R }; // Assuming the formula will be written in column B (index 1)
          const formulaCellRefJ = XLSX.utils.encode_cell(formulaCellAddressJ);
          statisticsWorksheet[formulaCellRefJ] = { f: formulaJ };

          // Formula for column H
          const formulaH = `=COUNTIF(Scheduel!K2:K1048576, "*" & INDIRECT("A${iter}") & "*")`;
          const formulaCellAddressH = { c: 2, r: R }; // Assuming the formula will be written in column C (index 2)
          const formulaCellRefH = XLSX.utils.encode_cell(formulaCellAddressH);
          statisticsWorksheet[formulaCellRefH] = { f: formulaH };
      }
        iter++;   
      }
    }


    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Convert buffer to a Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName + '.xlsx';

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
  }

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
