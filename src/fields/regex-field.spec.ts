import { RegexField } from "./regex-field";

describe('test', () => {
    test('should match', async () => {
        const schema = new RegexField({ pattern: /^Hi/ });
        const value = await schema.parse('Hi');
        expect(value).toEqual('Hi');
    });

    test('should not match', async () => {
        const schema = new RegexField({ pattern: /^Hi/ });

        await expect(
            async () => await schema.parse('hello')
        ).rejects.toThrow('This value does not match the required pattern.');
    });

});
