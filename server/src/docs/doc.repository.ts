import { Doc } from './doc.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateDocDto } from './dto/create-doc.dto';
import { DocStatus } from './doc-status.enum';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Doc)
export class DocRepository extends Repository<Doc> {
  private logger = new Logger('DocRepository');

  async getDocs(
    user: User,
  ): Promise<Doc[]> {
    const query = this.createQueryBuilder('doc');

    query.where('doc.userId = :userId', { userId: user.id });

    try {
      const docs = await query.getMany();
      return docs;
    } catch (error) {
      this.logger.error(`Failed to get docs for user "${user.username}".`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createDoc(
    createDocDto: CreateDocDto,
    user: User,
  ): Promise<Doc> {
    const { title, description, file } = createDocDto;

    const doc = new Doc();
    doc.title = title;
    doc.description = description;
    doc.status = DocStatus.OPEN;
    doc.user = user;
    doc.file = file;
    doc.result = '';

    try {
      await doc.save();
    } catch (error) {
      console.log({ error })
      this.logger.error(`Failed to create a doc for user "${user.username}". Data: ${createDocDto}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete doc.user;
    return doc;
  }
}
