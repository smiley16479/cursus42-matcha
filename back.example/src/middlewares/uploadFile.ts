import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../errors';
import { randomUUID } from 'crypto';
import path from 'path';

export interface UploadOptions {
    fieldname: string;
    dirname: string;
    supportedFormats: string[];
    filename?: (req: Request, file: Express.Multer.File, cb: (error: Error | null, name: string) => void) => void;
    maxSize?: number;
}

export const uploadFile = (options: UploadOptions) => {
    const storage = multer.diskStorage({
        destination: options.dirname,
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, name: string) => void) => {
            options.filename ? 
                options.filename(req, file, cb) :
                cb(null, randomUUID() + path.extname(file.originalname));
        }
    });

    const filter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const res = options.supportedFormats.find(format => file.mimetype.includes(format));

        if (res) {
            cb(null, true);
        } else {
            cb(new BadRequestError('Extension du fichier non supportée.'));
        }
    };

    return multer({
        storage,
        fileFilter: filter,
    }).single(options.fieldname);
};
