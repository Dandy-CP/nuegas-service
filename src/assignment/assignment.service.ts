import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAssignmentBody,
  CreateSubmissionResultBody,
  GivePointBody,
  UpdateAssignmentStatusBody,
} from './dto/payload.dto';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  async getClassAssignment(classId: string) {
    if (!classId)
      throw new UnprocessableEntityException('Query "class_id" is required');

    return await this.prisma.classAssignments.findMany({
      where: {
        class_id: classId,
      },
      include: {
        topic: {
          select: {
            topic_id: true,
            name: true,
          },
        },
      },
      omit: {
        topic_id: true,
        user_id: true,
        class_id: true,
      },
    });
  }

  async getAssignmentDetail(assignmentId: string) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
      include: {
        topic: {
          select: {
            topic_id: true,
            name: true,
          },
        },
        comment: {
          select: {
            comment_id: true,
            content: true,
            user: {
              select: {
                user_id: true,
                name: true,
                profile_image: true,
              },
            },
          },
        },
      },
      omit: {
        topic_id: true,
        user_id: true,
        class_id: true,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assignment not found');

    return assignmentInDB;
  }

  async createAssignment(
    payload: CreateAssignmentBody,
    classId: string,
    userId: string,
  ) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    const classMemberInDB = await this.prisma.classMember.findUnique({
      where: {
        user_id_class_code: {
          user_id: userId,
          class_code: classInDB.class_code,
        },
      },
    });

    if (classMemberInDB?.role !== 'OWNER')
      throw new UnprocessableEntityException(
        'Create Assignment must be Owner member',
      );

    return await this.prisma.classAssignments.create({
      data: {
        title: payload.title,
        content: payload.content,
        attachment: payload.attachment,
        start_date: payload.start_date,
        due_date: payload.due_date,
        topic: {
          connect: {
            topic_id: payload.topic,
          },
        },
        class: {
          connect: {
            class_id: classId,
          },
        },
        user: {
          connect: {
            user_id: userId,
          },
        },
      },
    });
  }

  async updateAssigment(
    payload: CreateAssignmentBody,
    assignmentId: string,
    userId: string,
  ) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
      include: {
        class: true,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assignment not found');

    const classMemberInDB = await this.prisma.classMember.findUnique({
      where: {
        user_id_class_code: {
          user_id: userId,
          class_code: assignmentInDB.class.class_code,
        },
      },
    });

    if (classMemberInDB?.role !== 'OWNER')
      throw new UnprocessableEntityException(
        'Update Assignment must be Owner member',
      );

    return await this.prisma.classAssignments.update({
      where: {
        assignments_id: assignmentId,
      },
      data: {
        title: payload.title,
        content: payload.content,
        attachment: payload.attachment,
        start_date: payload.start_date,
        due_date: payload.due_date,
        topic: {
          connect: {
            topic_id: payload.topic,
          },
        },
      },
    });
  }

  async deleteAssigment(assignmentId: string, userId: string) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
      include: {
        class: true,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assignment not found');

    const classMemberInDB = await this.prisma.classMember.findUnique({
      where: {
        user_id_class_code: {
          user_id: userId,
          class_code: assignmentInDB.class.class_code,
        },
      },
    });

    if (classMemberInDB?.role !== 'OWNER')
      throw new UnprocessableEntityException(
        'Delete Assignment must be Owner member',
      );

    await this.prisma.classAssignments.delete({
      where: {
        assignments_id: assignmentId,
      },
    });

    return {
      message: 'Success delete assigment',
    };
  }

  async updateAssignmentStatus(
    payload: UpdateAssignmentStatusBody,
    assignmentId: string,
    userId: string,
  ) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
      include: {
        class: true,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assignment not found');

    const classMemberInDB = await this.prisma.classMember.findUnique({
      where: {
        user_id_class_code: {
          user_id: userId,
          class_code: assignmentInDB.class.class_code,
        },
      },
    });

    if (classMemberInDB?.role !== 'OWNER')
      throw new UnprocessableEntityException(
        'Update Assignment status must be Owner member',
      );

    await this.prisma.classAssignments.update({
      where: {
        assignments_id: assignmentId,
      },
      data: {
        is_available: payload.is_available,
      },
    });

    return {
      message: `Success update assignment status to ${payload.is_available}`,
    };
  }

  async getSubmissionResultList(userId: string) {
    return await this.prisma.submissionResult.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async getSubmissionResultDetail(resultId: string) {
    const submissionResultInDB = await this.prisma.submissionResult.findUnique({
      where: {
        result_id: resultId,
      },
    });

    if (!submissionResultInDB)
      throw new NotFoundException('Submission result not found');

    return submissionResultInDB;
  }

  async createSubmissionResult(
    payload: CreateSubmissionResultBody,
    assignmentId: string,
    userId: string,
  ) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assigment not found');
    if (!assignmentInDB.is_available)
      throw new UnprocessableEntityException('Assignment has been closed');

    return await this.prisma.submissionResult.create({
      data: {
        attachment: payload.attachment,
        assignments_id: assignmentId,
        user_id: userId,
      },
    });
  }

  async updateSubmissionResult(
    payload: CreateSubmissionResultBody,
    assignmentId: string,
    resultId: string,
  ) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assigment not found');
    if (!assignmentInDB.is_available)
      throw new UnprocessableEntityException('Assignment has been closed');

    return await this.prisma.submissionResult.update({
      where: {
        result_id: resultId,
        assignments_id: assignmentId,
      },
      data: {
        attachment: payload.attachment,
      },
    });
  }

  async giveSubmissionResultPoint(
    payload: GivePointBody,
    assignmentId: string,
    resultId: string,
    userId: string,
  ) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
      include: {
        class: true,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assigment not found');

    const classMemberInDB = await this.prisma.classMember.findUnique({
      where: {
        user_id_class_code: {
          user_id: userId,
          class_code: assignmentInDB.class.class_code,
        },
      },
    });

    if (classMemberInDB?.role !== 'OWNER')
      throw new UnprocessableEntityException(
        'Given point must be Owner member',
      );

    return await this.prisma.submissionResult.update({
      where: {
        result_id: resultId,
        assignments_id: assignmentId,
      },
      data: {
        point: payload.point,
      },
    });
  }
}
