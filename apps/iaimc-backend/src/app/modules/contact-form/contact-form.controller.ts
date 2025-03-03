import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ContactFormService } from './contact-form.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactFormEntity } from './entity/contact-form.entity';

@Controller('contact_forms')
export class ContactFormController {
  constructor(private readonly contactFormService: ContactFormService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  public async submitForm(
    @Body() dto: ContactFormDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ContactFormEntity> {
    return this.contactFormService.createForm(dto, file);
  }
}
