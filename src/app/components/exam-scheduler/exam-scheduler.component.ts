import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exam-scheduler',
  templateUrl: './exam-scheduler.component.html',
  styleUrl: './exam-scheduler.component.css'
})
export class ExamSchedulerComponent {
  Exams: any[] = [];
  ExamsKeys: any[] = [];
  excelToArray(file: File): Promise<Array<Record<string, any>>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          if (sheet && sheet['!ref']) {
            const range = XLSX.utils.decode_range(sheet['!ref']);

            var result: Array<Record<string, any>> = [];

            for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
              const row: Record<string, any> = {};

              for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
                const cellValue = sheet[cellAddress]?.v;


                const key = XLSX.utils.encode_col(colIndex);
                row[key] = cellValue;
              }

              if (row['A'] !== 'Code' && row['I'] === 'Akkar') {
                result.push(row);
              }
            }

            resolve(result);

            result.forEach(entry => {
              entry['J'] = new Date(entry['J']);
            });

            result.sort((a, b) => a['J'].getTime() - b['J'].getTime());


            result.forEach(entry => {
              entry['J'] = entry['J'].toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            });


          } else {
            console.error('Sheet or range is undefined.');
          }

        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.excelToArray(file).then((data) => {
        // data = data.filter(data => data['A'] !== 'Code');
        // data = data.filter(data => data['I'] === 'Akkar');

        // data.forEach(entry => {
        //   entry['J'] = new Date(entry['J']);
        // });

        // data.sort((a, b) => a['J'].getTime() - b['J'].getTime());


        // data.forEach(entry => {
        //   entry['J'] = entry['J'].toLocaleDateString('en-US', {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric'
        //   });
        // });
        this.Exams = data;
        if (this.Exams.length > 0 && typeof this.Exams[0] === 'object') {
          this.ExamsKeys = Object.keys(this.Exams[0]);
        }
      }).catch((error) => {
        console.error('Error reading Excel file:', error);
      });
    }
  }
}
