import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
export declare class PlanController {
    private readonly planService;
    constructor(planService: PlanService);
    signUp(createPlanDto: CreatePlanDto): Promise<any>;
    getAll(): Promise<{
        plan: Plan[];
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePlanDto: UpdatePlanDto): Promise<any>;
    remove(id: string): Promise<any>;
}
