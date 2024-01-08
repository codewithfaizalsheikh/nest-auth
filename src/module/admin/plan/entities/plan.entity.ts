import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Plan {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  quaterly_price: number;

  @Prop()
  annual_price: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
