import { EducationEntity } from '@domain/user/entities/education.entity';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class UserProfileStudentEducationResponse {
  @TextProperty({ description: 'Шифр специальности', example: '09.02.01' })
  specialtyCipher: string;

  @TextProperty({ description: 'Название специальности', example: 'Прикладная математика и информатика' })
  specialtyTitle: string;

  @TextProperty({ description: 'Название группы', example: '9372' })
  groupTitle: string;

  constructor(education: EducationEntity) {
    this.groupTitle = education.group.title;
    this.specialtyCipher = education.group.specialty.cipher;
    this.specialtyTitle = education.group.specialty.title;
  }
}
