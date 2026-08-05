import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsExporterService {
  async exportToExcel(reportData: any[]): Promise<Buffer> {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    let currentColumn = 1; // Columna inicial
    const columnSpacing = 1; // Espacio entre matrices (en columnas)

    // Iterar sobre cada matriz en los datos del reporte
    for (const matrix of reportData) {
      if (!Array.isArray(matrix) || matrix.length < 2) continue;

      let currentRow = 1; // Reiniciar la fila para cada matriz

      // Primera fila: Título de la matriz
      const title = Array.isArray(matrix[0]) ? matrix[0][0] : matrix[0]; // Asegurarse de obtener el string del título
      const titleCell = worksheet.getCell(currentRow, currentColumn);
      titleCell.value = title;
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: 'center' };

      // Calcular el número de columnas de la matriz
      const numberOfColumns = Array.isArray(matrix[1]) ? matrix[1].length : 1;

      // Combinar celdas para el título según el número de columnas de la matriz
      worksheet.mergeCells(currentRow, currentColumn, currentRow, currentColumn + numberOfColumns - 1);
      currentRow++;

      // Segunda fila: Encabezados
      const headers = matrix[1];
      headers.forEach((header: string, index: number) => {
        const headerCell = worksheet.getCell(currentRow, currentColumn + index);
        headerCell.value = header;
        headerCell.font = { bold: true };
        headerCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      currentRow++;

      // Filas de datos
      const dataRows = matrix.slice(2);
      for (const row of dataRows) {
        row.forEach((cell: any, index: number) => {
          const dataCell = worksheet.getCell(currentRow, currentColumn + index);
          dataCell.value = cell;
          dataCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
        currentRow++;
      }

      // Ajustar automáticamente el ancho de las columnas al contenido más largo
      const totalRows = [headers, ...dataRows]; // Combinar encabezados y datos
      totalRows[0].forEach((_, colIndex: number) => {
        const columnData = totalRows.map(row => row[colIndex]); // Obtener todos los valores de la columna
        const maxLength = columnData.reduce((max, value) => {
          const length = value ? value.toString().length : 0;
          return Math.max(max, length);
        }, 0);
        worksheet.getColumn(currentColumn + colIndex).width = maxLength + 2; // Ajustar con un margen
      });

      // Aplicar bordes a toda la matriz
      const startRow = currentRow - dataRows.length - 2; // Fila inicial de la matriz (incluye título y encabezados)
      const endRow = currentRow - 1; // Última fila de la matriz
      const endColumn = currentColumn + headers.length - 1; // Última columna de la matriz
      for (let row = startRow; row <= endRow; row++) {
        for (let col = currentColumn; col <= endColumn; col++) {
          const cell = worksheet.getCell(row, col);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      }

      // Mover la columna inicial para la siguiente matriz
      currentColumn += numberOfColumns + columnSpacing;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer; // Retorna el buffer del archivo generado
  }
}