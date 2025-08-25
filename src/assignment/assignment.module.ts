import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { ClassModule } from '../class/class.module';
import { ClassService } from '../class/class.service';

@Module({
  imports: [ClassModule],
  controllers: [AssignmentController],
  providers: [AssignmentService, ClassService],
})
export class AssignmentModule {}
