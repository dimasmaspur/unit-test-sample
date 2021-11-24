import { NextFunction, Request, Response } from 'express';
import { BaseController } from './base-controller';
import Logger from '../services/logger';
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

class HealthCheckController extends BaseController {
    private message: String;

    constructor() {
        super();
        this.message = 'pong';
    }

    public healthCheck = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('server health check');
        let request: any = req.useragent;
        return this.ok(res, {
            message: this.message,
            response: request
        });
    };

    public excel2Sheet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Definisikan header
            const header = ['ID', 'Nama', 'Umur']; // Definisikan data
            const data = [
                ['1', 'Denny', '24'],
                ['2', 'Aditya', '25'],
                ['3', 'Pradipta', '26'],
                ['4', 'Ardhie', '27'],
                ['5', 'Putra', '28'],
                ['6', 'Prananta', '29']
            ]; // Definisikan rows untuk ditulis ke dalam spreadsheet
            const rows = [header, ...data]; // Buat Workbook
            const fileName = 'AOA_XLS';
            let wb = XLSX.utils.book_new();
            wb.Props = {
                Title: fileName,
                Author: 'Denny Pradipta',
                CreatedDate: new Date()
            }; // Buat Sheet
            wb.SheetNames.push('Rkh Rawat'); // Buat Sheet dengan Data
            let ws = XLSX.utils.aoa_to_sheet(rows);

            wb.Sheets['Rkh Rawat'] = ws;

            // Sheet 2
            const header1 = ['ID Sheet2', 'Nama Sheet2', 'Umur Sheet2']; // Definisikan data
            const data1 = [
                ['1', 'Denny', '24'],
                ['2', 'Aditya', '25'],
                ['3', 'Pradipta', '26'],
                ['4', 'Ardhie', '27'],
                ['5', 'Putra', '28'],
                ['6', 'Prananta', '29']
            ]; // Definisikan rows untuk ditulis ke dalam spreadsheet
            const rows2 = [header1, ...data1]; // Buat Workbook
            wb.SheetNames.push('Rkh Panen'); // Buat Sheet dengan Data
            let ws2 = XLSX.utils.aoa_to_sheet(rows2);
            wb.Sheets['Rkh Panen'] = ws2;

            __dirname; // Cek apakah folder downloadnya sudah ada
            const downloadFolder = path.resolve(__dirname, './../downloads');
            if (!fs.existsSync(downloadFolder)) {
                fs.mkdirSync(downloadFolder);
            }

            // Simpan filenya
            XLSX.writeFile(wb, `${downloadFolder}${path.sep}${fileName}.xls`);
            res.download(`${downloadFolder}${path.sep}${fileName}.xls`);
        } catch (error) {}
    };
}

export default new HealthCheckController();
