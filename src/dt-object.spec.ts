import { DTObject } from "./dt-object";
import { BooleanField } from "./fields/boolean-field";
import { StringField } from "./fields/string-field";


describe('test', () => {
    test('simple fields should succeed', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
        }

        const person = new Person({}).parse({ firstName: 'Robert', lastName: 'Singer' });
        expect(person.firstName).toEqual('Robert');
        expect(person.lastName).toEqual('Singer');
    });

    test('should fail if required field missing', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
        }

        expect(() => new Person({}).parse({ firstName: 'Robert' })).toThrowError('This field is required.')
    });

    test('should use default for missing field', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind({ "default": "James" })
        }

        const person = new Person().parse({ firstName: 'Robert' });
        expect(person.firstName).toEqual('Robert');
        expect(person.lastName).toEqual('James');
    });

    test('should parse nested object', async () => {
        class Job extends DTObject {
            title = StringField.bind()
            isSatisfying = BooleanField.bind()
        }

        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind({ "default": "James" })
            job = Job.bind()
        }

        const person = new Person().parse({ firstName: 'Robert', job: { title: 'Programmer', isSatisfying: true } });
        expect(person.firstName).toEqual('Robert');
        expect(person.lastName).toEqual('James');
        expect(person.job.title).toEqual('Programmer');
        expect(person.job.isSatisfying).toEqual(true);
    });

    test('should parse triple nested object', async () => {
        class EmployerDto extends DTObject {
            name = StringField.bind()
            public = BooleanField.bind()
        }

        class JobDto extends DTObject {
            title = StringField.bind()
            isSatisfying = BooleanField.bind()
        }

        class PersonDto extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind({ "default": "James" })
            job = JobDto.bind()
        }

        const person = new PersonDto().parse({ firstName: 'Robert', job: { title: 'Programmer', isSatisfying: true } });
        expect(person.firstName).toEqual('Robert');
        expect(person.lastName).toEqual('James');
        expect(person.job.title).toEqual('Programmer');
        expect(person.job.isSatisfying).toEqual(true);
    });
});
