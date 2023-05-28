import { DateTimeField } from "./date-time-field";


describe('test parse', () => {
    test('should parse string', async () => {
        const dtSchema = new DateTimeField();
        const v = dtSchema.parse('2000-01-01');
        expect(v).toEqual(new Date('2000-01-01'))
    });

    test('should pass through date', async () => {
        const dtSchema = new DateTimeField();
        const dateInstance = new Date('2023-01-12T23:57:19Z');
        const v = dtSchema.parse(dateInstance);
        expect(v).toEqual(dateInstance)
    });

    test('should raise for invalid string', async () => {
        const dtSchema = new DateTimeField();
        expect(() => dtSchema.parse('asdasdfasdfa')).toThrow('Invalid date-time passed.');
    });

    test('should raise for date that is too old', async () => {
        const dtSchema = new DateTimeField({ minDate: new Date('2022-02-02') });
        expect(() => dtSchema.parse('2022-01-02')).toThrow('Ensure the value is at least Tue Feb 01 2022');
    });

    test('should raise for date that is too new', async () => {
        const dtSchema = new DateTimeField({ maxDate: new Date('2022-03-02') });
        expect(() => dtSchema.parse('2022-03-03')).toThrow('Ensure the value is no more than Tue Mar 01 2022');
    });
});

describe('test format', () => {
    test('format string', async () => {
        const schema = new DateTimeField({});
        const value = schema.format('2022-02-01');
        expect(value).toEqual('2022-02-01');
    });

    test('format date', async () => {
        const schema = new DateTimeField({});
        const value = schema.format(new Date('2021-03-03T04:45'));
        expect(value).toEqual('2021-03-03T10:45:00.000Z');
    });
});
