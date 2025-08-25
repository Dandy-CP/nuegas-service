import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClassService } from '../class/class.service';
import {
  CreateAssignmentBody,
  CreateSubmissionResultBody,
  GivePointBody,
  UpdateAssignmentStatusBody,
} from './dto/payload.dto';
import { QueryPagination } from '../prisma/dto/pagination.dto';

@Injectable()
export class AssignmentService {
  constructor(
    private prisma: PrismaService,
    private classService: ClassService,
  ) {}

  async getClassAssignment(
    classId: string,
    queryPage: QueryPagination,
    userId: string,
  ) {
    if (!classId)
      throw new UnprocessableEntityException('Query "class_id" is required');

    await this.classService.isMemberInClass(userId);

    const [data, meta] = await this.prisma
      .extends()
      .classAssignments.paginate({
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
      })
      .withPages({
        page: queryPage.page,
        limit: queryPage.limit,
      });

    return {
      data,
      meta,
    };
  }

  async getAssignmentDetail(assignmentId: string, userId: string) {
    await this.classService.isMemberInClass(userId);

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

    await this.classService.isUserOwnerClass(userId);

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

  async updateAssignment(
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

    await this.classService.isUserOwnerClass(userId);

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

  async deleteAssignment(assignmentId: string, userId: string) {
    const assignmentInDB = await this.prisma.classAssignments.findUnique({
      where: {
        assignments_id: assignmentId,
      },
      include: {
        class: true,
      },
    });

    if (!assignmentInDB) throw new NotFoundException('Assignment not found');

    await this.classService.isUserOwnerClass(userId);

    await this.prisma.classAssignments.delete({
      where: {
        assignments_id: assignmentId,
      },
    });

    return {
      message: 'Success delete assignment',
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

    await this.classService.isUserOwnerClass(userId);

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

  async getUserSubmissionResultList(
    userId: string,
    queryPage: QueryPagination,
  ) {
    await this.classService.isMemberInClass(userId);

    const [data, meta] = await this.prisma
      .extends()
      .submissionResult.paginate({
        where: {
          user_id: userId,
        },
        include: {
          assignments: true,
        },
        omit: {
          user_id: true,
          assignments_id: true,
        },
      })
      .withPages({
        page: queryPage.page,
        limit: queryPage.limit,
      });

    return {
      data,
      meta,
    };
  }

  async getAllMemberResult(
    assignmentId: string,
    userId: string,
    queryPage: QueryPagination,
  ) {
    await this.classService.isUserOwnerClass(userId);

    const [data, meta] = await this.prisma
      .extends()
      .submissionResult.paginate({
        where: {
          assignments: {
            assignments_id: assignmentId,
          },
        },
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
            },
          },
        },
        omit: {
          user_id: true,
          assignments_id: true,
        },
      })
      .withPages({ page: queryPage.page, limit: queryPage.limit });

    return {
      data,
      meta,
    };
  }

  async getSubmissionResultDetail(resultId: string) {
    const submissionResultInDB = await this.prisma.submissionResult.findUnique({
      where: {
        result_id: resultId,
      },
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
          },
        },
        comment: true,
      },
      omit: {
        user_id: true,
        assignments_id: true,
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

    if (!assignmentInDB) throw new NotFoundException('Assignment not found');
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

    if (!assignmentInDB) throw new NotFoundException('Assignment not found');
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
