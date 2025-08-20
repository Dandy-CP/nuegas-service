import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassBody, InviteMemberBody } from './dto/payload.dto';
import { genClassCode } from 'utils/genClassCode';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async getMyClass(userId: string) {
    return await this.prisma.class.findMany({
      where: {
        owner_user_id: userId,
      },
      include: {
        class_members: {
          select: {
            user: {
              select: {
                user_id: true,
                name: true,
                email: true,
                profile_image: true,
              },
            },
          },
        },
      },
      omit: {
        owner_user_id: true,
      },
    });
  }

  async getJoinedClass(userId: string) {
    return await this.prisma.classMember.findMany({
      where: {
        user_id: userId,
      },
      include: {
        class: true,
      },
    });
  }

  async getClassDetail(classId: string) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
      include: {
        class_members: {
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                email: true,
                profile_image: true,
              },
            },
          },
          omit: {
            class_code: true,
            user_id: true,
          },
        },
        class_assignments: true,
        class_quiz: true,
        class_timeline: true,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    return classInDB;
  }

  async createMyClass(payload: CreateClassBody, userId: string) {
    const classCode = genClassCode();

    const createdValue = await this.prisma.class.create({
      data: {
        name: payload.class_name,
        description: payload.class_description,
        class_code: classCode,
        class_owner: {
          connect: {
            user_id: userId,
          },
        },
      },
    });

    // Join class as OWNER
    await this.joinClass(userId, createdValue.class_code, 'OWNER');

    return {
      message: 'Success create new class',
      data: createdValue,
    };
  }

  async joinClass(
    userId: string,
    classCode: string,
    role: 'MEMBER' | 'OWNER' = 'MEMBER',
  ) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_code: classCode,
      },
    });

    const userHasInClass = await this.prisma.classMember.findUnique({
      where: {
        user_id_class_code: {
          user_id: userId,
          class_code: classCode,
        },
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');
    if (userHasInClass)
      throw new UnprocessableEntityException('User has joined class');

    return await this.prisma.classMember.create({
      data: {
        user_id: userId,
        class_code: classCode,
        role: role,
      },
    });
  }

  async inviteMember(payload: InviteMemberBody, classCode: string) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_code: classCode,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    for (let index = 0; index < payload.users.length; index++) {
      const userId = payload.users[index];

      const userHasInClass = await this.prisma.classMember.findUnique({
        where: {
          user_id_class_code: {
            user_id: userId,
            class_code: classCode,
          },
        },
      });

      if (userHasInClass)
        throw new UnprocessableEntityException('User has joined class');

      await this.prisma.classMember.create({
        data: {
          user_id: userId,
          class_code: classCode,
        },
      });
    }

    return {
      message: `Success invite ${payload.users.length} member`,
    };
  }

  async getClassMember(classCode: string) {
    const classInDB = await this.prisma.class.findUnique({
      where: { class_code: classCode },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    return this.prisma.classMember.findMany({
      where: {
        class_code: classCode,
      },
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            email: true,
            profile_image: true,
          },
        },
      },
      omit: {
        user_id: true,
        class_code: true,
      },
    });
  }

  async deleteClassMember(memberId: string) {
    const userHasInClass = await this.prisma.classMember.findUnique({
      where: {
        class_member_id: memberId,
      },
    });

    if (!userHasInClass) throw new NotFoundException('User not in class');

    await this.prisma.classMember.delete({
      where: {
        class_member_id: memberId,
      },
    });

    return {
      message: 'Success delete member class',
    };
  }

  async deleteClass(classId: string) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    await this.prisma.classMember.deleteMany({
      where: {
        class_code: classInDB.class_code,
      },
    });

    await this.prisma.classPost.deleteMany({
      where: {
        class_id: classId,
      },
    });

    await this.prisma.classAssignments.deleteMany({
      where: {
        class_id: classId,
      },
    });

    await this.prisma.classQuiz.deleteMany({
      where: {
        class_id: classId,
      },
    });

    await this.prisma.class.delete({
      where: {
        class_id: classId,
      },
    });

    return {
      message: 'Success delete class',
    };
  }
}
