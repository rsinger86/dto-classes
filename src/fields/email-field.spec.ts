import { EmailField } from "./email-field";

describe('test', () => {
    test('should fail for invalid email', async () => {
        const schema = new EmailField({});
        expect(() => schema.parse('tester.at.hotmail')).toThrowError('Not a valid email address')
    });

    test('should pass for valid email', async () => {
        const schema = new EmailField({});
        const value = schema.parse('tester@hotmail.com');
        expect(value).toEqual('tester@hotmail.com');
    });
});
