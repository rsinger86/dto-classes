import { EmailField } from "./email-field";

describe('test', () => {
    test('should fail for invalid email', async () => {
        const schema = new EmailField({});
        await expect(
            async () => await schema.parse('tester.at.hotmail')
        ).rejects.toThrowError('Not a valid email address')
    });

    test('should pass for valid email', async () => {
        const schema = new EmailField({});
        const value = await schema.parse('tester@hotmail.com');
        expect(value).toEqual('tester@hotmail.com');
    });
});
