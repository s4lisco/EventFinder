import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Prüft, ob das dekorierte Datumsfeld nach dem angegebenen Referenzfeld liegt.
 * Wird nur geprüft wenn beide Felder einen Wert haben.
 *
 * @example
 * @IsAfter('startDate', { message: 'endDate must be after startDate' })
 * endDate?: string;
 */
export function IsAfter(referenceField: string, options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsAfter',
      target: (object as any).constructor,
      propertyName,
      constraints: [referenceField],
      options,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [ref] = args.constraints as [string];
          const referenceValue = (args.object as Record<string, unknown>)[ref];
          if (!value || !referenceValue) return true;
          return new Date(value as string) > new Date(referenceValue as string);
        },
        defaultMessage(args: ValidationArguments): string {
          const [ref] = args.constraints as [string];
          return `${args.property} must be after ${ref}`;
        },
      },
    });
  };
}
