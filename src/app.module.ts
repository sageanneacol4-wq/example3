import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

const dbUrl =
  process.env.MYSQL_PUBLIC_URL ||
  process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ Database URL is not defined!');
  throw new Error('Database URL is not defined!');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: dbUrl,
      autoLoadEntities: true,
      synchronize: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}