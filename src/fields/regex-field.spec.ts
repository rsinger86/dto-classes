import { RegexField } from "./regex-field";

describe('test', () => {
    test('should match', async () => {
        const schema = new RegexField({ pattern: /^Hi/ });
        const value = await schema.parseAsync('Hi');
        expect(value).toEqual('Hi');
    });

    test('should not match', async () => {
        const schema = new RegexField({ pattern: /^Hi/ });
        expect(() => schema.parse('hello')).toThrow('This value does not match the required pattern.');
    });

});
