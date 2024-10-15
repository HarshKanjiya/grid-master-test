import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform<T>(items: T[], searchTerm: string): T[] {
        if (!items || !searchTerm) {
            return items;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();

        return items.filter(item => {
            if (typeof item === 'string') {
                return item.toLowerCase().includes(lowerSearchTerm);
            } else if (typeof item === 'object' && item !== null) {
                return Object.values(item).some(value =>
                    String(value).toLowerCase().includes(lowerSearchTerm)
                );
            }
            return false;
        });
    }
}
