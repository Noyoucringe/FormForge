import { Profile, ProfileData } from '../types/index';
import { FormDetectionService } from './formDetectionService';

export class AutofillService {
  static fillField(
    fieldElement: HTMLInputElement | HTMLTextAreaElement,
    value: string
  ): void {
    fieldElement.value = value;
    fieldElement.dispatchEvent(new Event('input', { bubbles: true }));
    fieldElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  static autofillForm(fields: any[], profile: Profile): void {
    const { data } = profile;

    fields.forEach((field) => {
      const element = FormDetectionService.findFieldElement(field.id, field.name);
      if (!element) return;

      const value = this.getValueForField(field.type, data);
      if (value) {
        this.fillField(element, value);
      }
    });
  }

  private static getValueForField(fieldType: string, data: ProfileData): string {
    switch (fieldType) {
      case 'fullName':
        return data.fullName || '';
      case 'email':
        return data.email || '';
      case 'phone':
        return data.phone || '';
      case 'linkedin':
        return data.linkedin || '';
      case 'github':
        return data.github || '';
      case 'skills':
        return data.skills?.join(', ') || '';
      case 'education':
        return (
          data.education
            ?.map((e) => `${e.degree} in ${e.field} from ${e.institution}`)
            .join('; ') || ''
        );
      case 'experience':
        return (
          data.experience
            ?.map((e) => `${e.position} at ${e.company} (${e.years} years)`)
            .join('; ') || ''
        );
      default:
        return '';
    }
  }
}
