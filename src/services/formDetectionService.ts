import { FormField } from '../types/index';

export class FormDetectionService {
  static fieldPatterns = {
    fullName: /name|full.?name|applicant.?name/i,
    firstName: /first.?name|fname/i,
    lastName: /last.?name|lname/i,
    email: /email|e.?mail|email.?address/i,
    phone: /phone|mobile|contact|phone.?number/i,
    linkedin: /linkedin|linkedin.?url|linkedin.?profile/i,
    github: /github|github.?url|github.?profile/i,
    skills: /skills|expertise|technical.?skills/i,
    education: /education|degree|university|college|school/i,
    experience: /experience|employment|work.?history/i,
  };

  static detectFields(): FormField[] {
    const fields: FormField[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach((element) => {
      let name = '';
      let placeholder = '';
      let type = 'text';
      let value = '';
      let id = '';

      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        name = element.name || element.id || element.placeholder || '';
        placeholder = element.placeholder || '';
        type = (element instanceof HTMLInputElement) ? element.type || 'text' : 'text';
        value = element.value || '';
        id = element.id || '';
      } else if (element instanceof HTMLSelectElement) {
        name = element.name || element.id || '';
        placeholder = '';
        type = 'select';
        value = element.value || '';
        id = element.id || '';
      }

      if (this.isRelevantField(name, placeholder, type)) {
        fields.push({
          type: this.getFieldType(name, placeholder, type),
          name,
          id: id || this.generateId(),
          placeholder,
          value,
        });
      }
    });

    return fields;
  }

  private static isRelevantField(
    name: string,
    placeholder: string,
    type: string
  ): boolean {
    const combined = `${name} ${placeholder}`.toLowerCase();
    
    return (
      this.fieldPatterns.fullName.test(combined) ||
      this.fieldPatterns.firstName.test(combined) ||
      this.fieldPatterns.lastName.test(combined) ||
      this.fieldPatterns.email.test(combined) ||
      this.fieldPatterns.phone.test(combined) ||
      this.fieldPatterns.linkedin.test(combined) ||
      this.fieldPatterns.github.test(combined) ||
      this.fieldPatterns.skills.test(combined) ||
      this.fieldPatterns.education.test(combined) ||
      this.fieldPatterns.experience.test(combined)
    );
  }

  private static getFieldType(
    name: string,
    placeholder: string,
    type: string
  ): string {
    const combined = `${name} ${placeholder}`.toLowerCase();

    if (this.fieldPatterns.fullName.test(combined)) return 'fullName';
    if (this.fieldPatterns.firstName.test(combined)) return 'firstName';
    if (this.fieldPatterns.lastName.test(combined)) return 'lastName';
    if (this.fieldPatterns.email.test(combined)) return 'email';
    if (this.fieldPatterns.phone.test(combined)) return 'phone';
    if (this.fieldPatterns.linkedin.test(combined)) return 'linkedin';
    if (this.fieldPatterns.github.test(combined)) return 'github';
    if (this.fieldPatterns.skills.test(combined)) return 'skills';
    if (this.fieldPatterns.education.test(combined)) return 'education';
    if (this.fieldPatterns.experience.test(combined)) return 'experience';

    return 'unknown';
  }

  private static generateId(): string {
    return 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  static findFieldElement(fieldId: string, fieldName: string): HTMLInputElement | HTMLTextAreaElement | null {
    let element = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null;

    if (!element) {
      element = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
    }

    if (!element) {
      element = document.querySelector(`input[placeholder*="${fieldName}"]`) as HTMLInputElement | null;
    }

    return element;
  }
}
