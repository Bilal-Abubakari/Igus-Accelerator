import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactFormEntity } from './entity/contact-form.entity';
import { ContactFormDto } from './dto/contact-form.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileStoreDirectory } from '../../common/types';

interface CloudinaryUploadResult {
  secure_url: string;
}

@Injectable()
export class ContactFormService {
  constructor(
    @InjectRepository(ContactFormEntity)
    private readonly contactFormRepository: Repository<ContactFormEntity>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async createForm(
    dto: ContactFormDto,
    file?: Express.Multer.File,
  ): Promise<ContactFormEntity> {
    const contactForm = this.contactFormRepository.create(dto);

    if (file) {
      const response = await this.fileUploadService.uploadFile(
        file,
        FileStoreDirectory.CONTACT_FORMS,
      );
      const uploadResult = response.data as CloudinaryUploadResult;
      contactForm.fileUrl = uploadResult.secure_url;
    }

    return this.contactFormRepository.save(contactForm);
  }
}
