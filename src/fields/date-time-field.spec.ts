import { DateTimeField } from "./date-time-field";


describe('test parse', () => {
    test('should parse string', async () => {
        const dtSchema = new DateTimeField();
        const v = await dtSchema.parseValue('2000-01-01');
        expect(v).toEqual(new Date('2000-01-01'))
    });

    test('should pass through date', async () => {
        const dtSchema = new DateTimeField();
        const dateInstance = new Date('2023-01-12T23:57:19Z');
        const v = await dtSchema.parseValue(dateInstance);
        expect(v).toEqual(dateInstance)
    });

    test('should raise for invalid string', async () => {
        const dtSchema = new DateTimeField();
        await expect(
            async () => await dtSchema.parseValue('asdasdfasdfa')
        ).rejects.toThrow('Invalid date-time passed.');
    });

    test('should raise for date that is too old', async () => {
        const dtSchema = new DateTimeField({ minDate: new Date('2022-02-02') });
        await expect(
            async () => await dtSchema.parseValue('2022-01-02')
        ).rejects.toThrow('Ensure the value is at least Tue Feb 01 2022');
    });

    test('should raise for date that is too new', async () => {
        const dtSchema = new DateTimeField({ maxDate: new Date('2022-03-02') });
        await expect(
            async () => await dtSchema.parseValue('2022-03-03')
        ).rejects.toThrow('Ensure the value is no more than Tue Mar 01 2022');
    });
});

describe('test format', () => {
    test('format string', async () => {
        const schema = new DateTimeField({});
        const value = await schema.formatValue('2022-02-01');
        expect(value).toEqual('2022-02-01');
    });

    test('format date', async () => {
        const schema = new DateTimeField({});
        const value = await schema.formatValue(new Date('2021-03-03T04:45'));
        expect(value).toEqual('2021-03-03T10:45:00.000Z');
    });
});
