import { BooleanField } from "./boolean-field";
import { CombineField } from "./combine-field";
import { NumberField } from "./number-field";
import { StringField } from "./string-field";

describe('anyOf parse tests', () => {
    test('should use number schema', async () => {
        const field = new CombineField({
            anyOf: [
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 1000 })
            ]
        });

        const value = await field.parseValue('999');
        expect(value).toEqual(999);
    });

    test('should use string schema', async () => {
        const field = new CombineField({
            anyOf: [
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 1000 })
            ]
        });

        const value = await field.parseValue('99');
        expect(value).toEqual('99');
    });

    test('should use boolean schema', async () => {
        const field = new CombineField({
            anyOf: [
                BooleanField.bind(),
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 1000 })
            ]
        });

        const value = await field.parseValue('1');
        expect(value).toEqual(true);
    });

    test('should fail if no matches', async () => {
        const t = async () => {
            await CombineField.parse('9999999999999', {
                anyOf: [
                    BooleanField.bind(),
                    StringField.bind({ maxLength: 2 }),
                    NumberField.bind({ maxValue: 1000 })
                ]
            },)
        }
        await expect(t).rejects.toThrow('None of the subschemas matched');
    });

    test('null should match first schema allowing null', async () => {
        const value = await CombineField.parse(null, {
            anyOf: [
                BooleanField.bind(),
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ allowNull: true })
            ]
        });

        expect(value).toEqual(null);
    });
});

