import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Payment } from './entites/payment.entity';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
    imports:[TypeOrmModule.forFeature([Payment, Restaurant])],
    providers: [
        PaymentsResolver, PaymentsService
    ]
})
export class PaymentsModule {}
