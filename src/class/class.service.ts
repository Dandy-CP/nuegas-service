import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassBody, InviteMemberBody } from './dto/payload.dto';
import { genClassCode } from '../../utils/genClassCode';
import { QueryPagination } from '../prisma/dto/pagination.dto';
import { NodemailerService } from '../nodemailer/nodemailer.service';

@Injectable()
export class ClassService {
  constructor(
    private prisma: PrismaService,
    private nodemailer: NodemailerService,
  ) {}

  async getMyClass(userId: string, queryPage: QueryPagination) {
    const [data, meta] = await this.prisma
      .extends()
      .class.paginate({
        where: {
          owner_user_id: userId,
        },
        omit: {
          owner_user_id: true,
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

  async getJoinedClass(userId: string, queryPage: QueryPagination) {
    const [data, meta] = await this.prisma
      .extends()
      .class.paginate({
        where: {
          class_members: {
            some: {
              user_id: userId,
            },
          },
        },
        omit: {
          owner_user_id: true,
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

  async getClassDetail(classId: string, userId: string) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
        class_members: {
          some: {
            user_id: userId,
          },
        },
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
      omit: {
        owner_user_id: true,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    return classInDB;
  }

  async createMyClass(payload: CreateClassBody, userId: string) {
    const classCode = await genClassCode();

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
      include: {
        user: {
          select: {
            user_id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async inviteMember(
    payload: InviteMemberBody,
    classId: string,
    userId: string,
  ) {
    await this.isUserOwnerClass(userId);

    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    let successInvited = 0;
    const invited: any[] = [];
    const joined: any[] = [];
    const errorOnInvite: any[] = [];

    const invitations = payload.email.map(async (userEmail) => {
      // find registered user in DB by email
      const userInDB = await this.prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      // if user has registered then directly add to class
      if (userInDB) {
        const userInClass = await this.prisma.classMember.findUnique({
          where: {
            user_id_class_code: {
              user_id: userInDB.user_id,
              class_code: classInDB.class_code,
            },
          },
          include: {
            user: {
              select: {
                user_id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        if (!userInClass) {
          const joinedMember = await this.prisma.classMember.create({
            data: {
              user_id: userInDB.user_id,
              class_code: classInDB.class_code,
            },
            include: {
              user: {
                select: {
                  user_id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });

          successInvited++;
          joined.push(joinedMember);
          return;
        }

        errorOnInvite.push({
          message: 'User has in class',
          data: userInClass.user,
        });

        return;
      }

      // if user not registered then send invitation email
      const { nanoid } = await import('nanoid');
      const tokenId = nanoid();
      const invitedUser = await this.prisma.invitation.create({
        data: {
          email: userEmail,
          token: tokenId,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          class: {
            connect: {
              class_id: classInDB.class_id,
            },
          },
        },
      });

      await this.nodemailer.sendInviteEmail(userEmail, tokenId);
      successInvited++;
      invited.push(invitedUser);
    });

    // execute all array in parallel promise
    await Promise.all(invitations);

    return {
      message: `Success invite ${successInvited} member`,
      data: {
        joined,
        invited,
        not_invited: errorOnInvite,
      },
    };
  }

  async getClassMember(
    classId: string,
    queryPage: QueryPagination,
    userId: string,
  ) {
    const classInDB = await this.prisma.class.findUnique({
      where: {
        class_id: classId,
        class_members: { some: { user_id: userId } },
      },
    });

    if (!classInDB) throw new NotFoundException('Class not found');

    const [data, meta] = await this.prisma
      .extends()
      .classMember.paginate({
        where: {
          class_code: classInDB?.class_code,
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

  async deleteClassMember(memberId: string, userId: string) {
    await this.isUserOwnerClass(userId);

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

  async deleteClass(classId: string, userId: string) {
    await this.isUserOwnerClass(userId);

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

  async isMemberInClass(userId: string) {
    const classMemberInDB = await this.prisma.class.findFirst({
      where: {
        class_members: {
          some: {
            user_id: userId,
          },
        },
      },
    });

    if (!classMemberInDB)
      throw new UnprocessableEntityException('You not part of class');
  }

  async isUserOwnerClass(userId: string) {
    const classInDB = await this.prisma.class.findFirst({
      where: {
        owner_user_id: userId,
      },
    });

    if (!classInDB)
      throw new UnprocessableEntityException('You not Owner class');
  }
}
