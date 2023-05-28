import { ValidationError } from "src/exceptions/validation-error";
import { BooleanField } from "./boolean-field";

describe('parse tests', () => {
    test('should allow null value', async () => {
        const boolSchema = new BooleanField({ allowNull: true });

        for (const v of ['null', 'Null', 'NULL', '', null]) {
            const value = boolSchema.parse(v);
            expect(value).toEqual(null);
        }
    });

    test('should not allow null value', async () => {
        const boolSchema = new BooleanField({ allowNull: false });

        for (const v of ['null', 'Null', 'NULL', '', null]) {
            const t = () => {
                boolSchema.parse('');

            }
            expect(t).toThrow(ValidationError);
        }
    });

    test('should parse to false', async () => {
        const boolSchema = new BooleanField({ allowNull: false });

        for (const v of [
            'f', 'F',
            'n', 'N', 'no', 'No', 'NO',
            'false', 'False', 'FALSE',
            'off', 'Off', 'OFF',
            '0', 0, 0.0,
            false
        ]) {
            const value = boolSchema.parse(v);
            expect(value).toEqual(false);
        }
    });

    test('should parse to true', async () => {
        const boolSchema = new BooleanField({ allowNull: false });

        for (const v of [
            't', 'T',
            'y', 'Y', 'yes', 'Yes', 'YES',
            'true', 'True', 'TRUE',
            'on', 'On', 'ON',
            '1', 1,
            true
        ]) {
            const value = boolSchema.parse(v);
            expect(value).toEqual(true);
        }
    });
});


describe('format tests', () => {
    test('should format as null', async () => {
        const boolSchema = new BooleanField({ allowNull: true });

        for (const v of ['null', 'Null', 'NULL', '', null]) {
            const value = boolSchema.format(v);
            expect(value).toEqual(null);
        }
    });

    test('should format to false', async () => {
        const boolSchema = new BooleanField({ allowNull: false });

        for (const v of [
            'f', 'F',
            'n', 'N', 'no', 'No', 'NO',
            'false', 'False', 'FALSE',
            'off', 'Off', 'OFF',
            '0', 0, 0.0,
            false
        ]) {
            const value = boolSchema.format(v);
            expect(value).toEqual(false);
        }
    });

    test('should format to true', async () => {
        const boolSchema = new BooleanField({ allowNull: false });

        for (const v of [
            't', 'T',
            'y', 'Y', 'yes', 'Yes', 'YES',
            'true', 'True', 'TRUE',
            'on', 'On', 'ON',
            '1', 1,
            true
        ]) {
            const value = boolSchema.parse(v);
            expect(value).toEqual(true);
        }
    });
});