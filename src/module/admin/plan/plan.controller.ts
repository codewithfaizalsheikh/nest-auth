import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { Plan } from './entities/plan.entity';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  //Add Plans
  @UseGuards(AuthGuard('jwt')) // Protects this route with authentication
  @Post('/add')
  async signUp(@Body() createPlanDto: CreatePlanDto): Promise<any> {
    return await this.planService.create(createPlanDto);
  }

  // Get all plans route
  @Get()
  // @UseGuards(AuthGuard('jwt')) // Protects this route with authentication
  async getAll(): Promise<{ plan: Plan[] }> {
    const plan = await this.planService.findAll();
    return plan;
  }

  // Get a single plan by ID
  @Get(':id')
  @UseGuards(AuthGuard('jwt')) // Protects this route with authentication
  async findOne(@Param('id') id: string) {
    return await this.planService.findById(id);
  }

  // Update plan by ID
  @Post(':id')
  @UseGuards(AuthGuard('jwt')) // Protects this route with authentication
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return await this.planService.update(id, updatePlanDto);
  }

  // Delete plan by ID
  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // Protects this route with authentication
  async remove(@Param('id') id: string) {
    return await this.planService.remove(id);
  }
}
