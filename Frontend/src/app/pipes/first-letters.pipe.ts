import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetters',
  standalone: false
})
export class FirstLettersPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Trim and split the string into words
    const words = value.trim().split(/\s+/);

    // If there's only one word
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    // If there are multiple words, take first letter of each word
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }
}
