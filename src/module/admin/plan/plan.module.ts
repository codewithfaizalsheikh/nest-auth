import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';
import { PlanSchema } from './entities/plan.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Plan', schema: PlanSchema }])],
  controllers: [PlanController],
  providers: [PlanService, CustomLoggerService],
})
export class PlanModule {}
