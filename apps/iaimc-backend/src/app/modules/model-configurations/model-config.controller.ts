import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  ALLOWED_MODEL_MIME_TYPES,
  MAX_STEP_FILE_SIZE_MB,
} from '../../common/constants';
import { FileSizeValidatorPipe } from '../../common/pipes/file-size.validator';
import { FileTypeValidatorPipe } from '../../common/pipes/file-type.validator';
import { MulterFile } from '../../common/types/file.types';
import { JwtUserPayload } from '../../common/types/general.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModelSnapshotDto } from './dtos/model-snapshot.dto';
import { ConfigCount, ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { ModelConfigService } from './model-config.service';

@Controller('configuration')
@UseGuards(JwtAuthGuard)
export class ModelConfigController {
  constructor(private readonly modelConfigService: ModelConfigService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public configurationUpload(
    @UploadedFile(
      new FileSizeValidatorPipe(MAX_STEP_FILE_SIZE_MB),
      new FileTypeValidatorPipe(ALLOWED_MODEL_MIME_TYPES),
    )
    file: MulterFile,
    @Req() { user }: Request,
  ): Promise<ModelConfigurationEntity> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.modelConfigService.uploadConfig(user as JwtUserPayload, file);
  }

  @Patch(':id/snapshot')
  public async setModelSnapshot(
    @Param('id') configId: string,
    @Body() { snapshot }: ModelSnapshotDto,
    @Req() { user }: Request,
  ): Promise<ModelConfigurationEntity | null> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.modelConfigService.setConfigSnapshot(
      user as JwtUserPayload,
      configId,
      snapshot,
    );
  }

  @Get(':id')
  public async getActiveConfig(
    @Param('id') activeConfig: string,
    @Req() { user }: Request,
  ): Promise<ModelConfigurationEntity | undefined> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.modelConfigService.getActiveConfig(
      user as JwtUserPayload,
      activeConfig,
    );
  }

  @Get('customer')
  public async getCustomerConfigs(
    @Req() { user }: Request,
  ): Promise<ModelConfigurationEntity[]> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.modelConfigService.getCustomerConfigurations(
      user as JwtUserPayload,
    );
  }

  @Get('count')
  public async getTotalConfigs(@Req() { user }: Request): Promise<ConfigCount> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.modelConfigService.getTotalCustomerConfigs(
      user as JwtUserPayload,
    );
  }
}
