import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; // Mongoose Model
import { Plan } from './entities/plan.entity';
import { CustomLoggerService } from 'src/core/services/custom-logger.service';
import { GlobalVariable } from 'src/config/enviorments';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<Plan>,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<any> {
    const { name, price, description, quaterly_price, annual_price } =
      createPlanDto;
    try {
      const plan = await this.planModel.create({
        name,
        price,
        description,
        quaterly_price,
        annual_price,
      });

      return {
        statusCode: 200,
        message: GlobalVariable.CREATE,
        data: plan,
      };
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      this.logger.error(
        `Error occurred during user fetch: ${error}`,
        error.stack,
      ); //custom logger

      return {
        statusCode: 500, // You can set an appropriate error status code
        message: GlobalVariable.FETCH_FAIL,
        error: error.message, // Include the error message in the response
      };
    }
  }

  // Method to Get all plan
  async findAll(): Promise<any> {
    try {
      const plan = await this.planModel.find().exec();
      const totatCount = await this.planModel.countDocuments();
      return {
        totatCount,
        statusCode: 200,
        message: GlobalVariable.FETCH,
        data: plan,
      };
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      this.logger.error(
        `Error occurred during user fetch: ${error}`,
        error.stack,
      ); //custom logger

      return {
        statusCode: 500, // You can set an appropriate error status code
        message: GlobalVariable.CREATE_FAIL,
        error: error.message, // Include the error message in the response
      };
    }
  }

  // Method to update plan details by ID
  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<any> {
    try {
      const updatedUser = await this.planModel.findByIdAndUpdate(
        id,
        updatePlanDto,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedUser) {
        throw new NotFoundException(GlobalVariable.NOT_FOUND);
      }

      return {
        statusCode: 200,
        message: GlobalVariable.UPDATE,
        data: updatedUser,
      };
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      this.logger.error(
        `Error occurred during user fetch: ${error}`,
        error.stack,
      ); //custom logger

      return {
        statusCode: 500, // You can set an appropriate error status code
        message: GlobalVariable.UPDATE_FAIL,
        error: error.message, // Include the error message in the response
      };
    }
  }

  // Method to delete a user by ID
  async remove(id: string): Promise<any> {
    try {
      return this.planModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      this.logger.error(
        `Error occurred during user fetch: ${error}`,
        error.stack,
      ); //custom logger

      return {
        statusCode: 500, // You can set an appropriate error status code
        message: GlobalVariable.DELETE_FAIL,
        error: error.message, // Include the error message in the response
      };
    }
  }

  // Method to find a single user by ID
  async findById(_id: string): Promise<any | null> {
    try {
      return this.planModel.findById({ _id }).exec();
    } catch (error) {
      console.log(error); // Log the error for debugging purposes

      this.logger.error(
        `Error occurred during user fetch: ${error}`,
        error.stack,
      ); //custom logger

      return {
        statusCode: 500, // You can set an appropriate error status code
        message: GlobalVariable.FETCH_FAIL,
        error: error.message, // Include the error message in the response
      };
    }
  }
}
