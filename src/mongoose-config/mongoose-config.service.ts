import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const user = this.configService.get<string>('MONGO_USERNAME');
    const pass = this.configService.get<string>('MONGO_PASSWORD');
    const host = this.configService.get<string>('MONGO_HOST');
    const port = this.configService.get<string>('MONGO_PORT');
    return {
      uri: `mongodb://${user}:${pass}@${host}:${port}/?authSource=admin`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
}
