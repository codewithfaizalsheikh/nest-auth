import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GlobalVariable } from 'src/config/enviorments'; //global enviorment variable

export class CreatePlanDto {
  // Validate that the name field is not empty and is a string
  @IsNotEmpty({ message: 'Name ' + GlobalVariable.NOT_EMPTY })
  @IsString({ message: 'Name ' + GlobalVariable.MUST_STRING })
  readonly name: string;

  // Validate that the email field is not empty and is in the correct email format
  @IsNotEmpty({ message: 'Price ' + GlobalVariable.NOT_EMPTY })
  @IsNumber({}, { message: 'Price ' + GlobalVariable.MUST_NUMBER })
  readonly price: number;

  @IsNotEmpty({ message: 'description ' + GlobalVariable.NOT_EMPTY })
  @IsString({ message: 'description ' + GlobalVariable.MUST_NUMBER })
  readonly description: string;

  @IsNotEmpty({ message: 'Quaterly Price ' + GlobalVariable.NOT_EMPTY })
  @IsNumber({}, { message: 'Quaterly Price ' + GlobalVariable.MUST_NUMBER })
  readonly quaterly_price: number;

  @IsNotEmpty({ message: 'Annual Price ' + GlobalVariable.NOT_EMPTY })
  @IsNumber({}, { message: 'Annual Price ' + GlobalVariable.MUST_NUMBER })
  readonly annual_price: number;
}
