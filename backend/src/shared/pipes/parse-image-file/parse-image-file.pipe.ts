import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class ParseImageFilePipe implements PipeTransform {
  public transform(value: Express.Multer.File): Express.Multer.File {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException('Only JPEG and PNG files are allowed');
    }

    const ext = path.extname(value.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException('File extension must be JPG, JPEG, or PNG');
    }

    const maxSize = 5 * 1024 * 1024;
    if (value.size > maxSize) {
      throw new BadRequestException('File size exceeds 5 MB');
    }

    return value;
  }
}
