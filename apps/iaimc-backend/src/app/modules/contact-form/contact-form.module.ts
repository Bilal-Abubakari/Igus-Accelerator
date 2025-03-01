import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactFormController } from './contact-form.controller';
import { ContactFormService } from './contact-form.service';
import { ContactFormEntity } from './entity/contact-form.entity';
import { FileUploadModule } from '../file-upload/file-upload.module'; // adjust the path if needed

@Module({
  imports: [FileUploadModule, TypeOrmModule.forFeature([ContactFormEntity])],
  controllers: [ContactFormController],
  providers: [ContactFormService],
})
export class ContactFormModule {}
