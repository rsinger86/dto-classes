import { AfterParse, Format } from "./decorators";
import { DTObject } from "./dt-object";
import { ArrayField } from "./fields/array-field";
import { BooleanField } from "./fields/boolean-field";
import { DateTimeField } from "./fields/date-time-field";
import { StringField } from "./fields/string-field";
import { Recursive } from "./recursive";


describe('test parse', () => {
    test('simple fields should succeed', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
        }

        const person = await new Person({}).parse({ firstName: 'Robert', lastName: 'Singer' });
        expect(person.firstName).toEqual('Robert');
        expect(person.lastName).toEqual('Singer');
    });

    test('should fail if required field missing', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
        }

        await expect(
            async () => await new Person({}).parse({ firstName: 'Robert' })
        ).rejects.toThrowError('This field is required.')
    });

    test('should use default for missing field', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind({ "default": "James" })
        }

        const person = await new Person().parse({ firstName: 'Robert' });
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

        const person = await new Person().parse({ firstName: 'Robert', job: { title: 'Programmer', isSatisfying: true } });
        expect(person.firstName).toEqual('Robert');
        expect(person.lastName).toEqual('James');
        expect(person.job.title).toEqual('Programmer');
        expect(person.job.isSatisfying).toEqual(true);
    });

    test('should parse triple nested object', async () => {
        class EmployerDto extends DTObject {
            name = StringField.bind()
            public = BooleanField.bind()
            dateStarted = DateTimeField.bind()
        }

        class JobDto extends DTObject {
            title = StringField.bind()
            isSatisfying = BooleanField.bind()
            company = EmployerDto.bind()
        }

        class PersonDto extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind({ "default": "James" })
            job = JobDto.bind()
        }

        const person = await new PersonDto().parse({
            firstName: 'Robert',
            job: {
                title: 'Programmer', isSatisfying: true,
                company: {
                    name: 'Dunder Mifflin',
                    public: false,
                    dateStarted: '1999-06-05'
                }
            }
        });
        expect(person.firstName).toEqual('Robert');
        expect(person.lastName).toEqual('James');
        expect(person.job.title).toEqual('Programmer');
        expect(person.job.isSatisfying).toEqual(true);
        expect(person.job.company.name).toEqual('Dunder Mifflin');
        expect(person.job.company.public).toEqual(false);
        expect(person.job.company.dateStarted).toEqual(new Date('1999-06-05'));
    });

});


describe('test getValues', () => {
    test('should getValues of nested object', async () => {
        class Job extends DTObject {
            title = StringField.bind()
            isSatisfying = BooleanField.bind()
        }

        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind({ "default": "James" })
            job = Job.bind()
        }

        const person = await new Person().parse({ firstName: 'Robert', job: { title: 'Programmer', isSatisfying: true } });
        const plainData = person.getValues()

        expect(plainData).toEqual({
            firstName: 'Robert',
            lastName: 'James',
            job: { title: 'Programmer', isSatisfying: true }
        });
    });
});

describe('test custom validators', () => {
    test('should getValues of nested object', async () => {
        class Job extends DTObject {
            title = StringField.bind()
            isSatisfying = BooleanField.bind()
        }

        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind({ "default": "James" })
            job = Job.bind()

            @AfterParse()
            validateNamesDifferent() {

            }
        }

        const person = await new Person().parse({ firstName: 'Robert', job: { title: 'Programmer', isSatisfying: true } });

    });
});


describe('test format', () => {
    test('format should exclude write only fields', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
            password = StringField.bind({ writeOnly: true })
        }

        const data = await new Person({}).format({ firstName: 'Robert', lastName: 'Singer', password: '123' });
        expect(data).toEqual({ firstName: 'Robert', lastName: 'Singer' });
    });

    test('format should obey formatSource', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
            birthday = DateTimeField.bind({ formatSource: 'dateOfBirth' })
        }

        const data = await new Person({}).format({
            firstName: 'Robert',
            lastName: 'Singer',
            dateOfBirth: new Date('1987-11-11')
        });

        expect(data).toEqual({
            firstName: 'Robert',
            lastName: 'Singer',
            birthday: "1987-11-11T00:00:00.000Z"
        });
    });

    test('format recursive array', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
            dateOfBirth = DateTimeField.bind()
            family = ArrayField.bind({ items: Recursive(Person) })
        }

        const data = await new Person({}).format({
            firstName: 'Steve',
            lastName: 'Coolman',
            dateOfBirth: new Date('1960-01-01'),
            family: [
                {
                    firstName: "Jake",
                    lastName: "Coolman",
                    family: [
                        {
                            firstName: "Child A",
                            lastName: "Coolman"
                        }
                    ]
                },
                {
                    firstName: "Tim",
                    lastName: "Coolman",
                    family: [
                        {
                            firstName: "Child B",
                            lastName: "Coolman"
                        }
                    ]
                }
            ]
        });

        const expected = {
            "firstName": "Steve",
            "lastName": "Coolman",
            "dateOfBirth": "1960-01-01T00:00:00.000Z",
            "family": [
                {
                    "firstName": "Jake",
                    "lastName": "Coolman",
                    "dateOfBirth": null,
                    "family": [
                        {
                            "firstName": "Child A",
                            "lastName": "Coolman",
                            "dateOfBirth": null,
                            "family": []
                        }
                    ]
                },
                {
                    "firstName": "Tim",
                    "lastName": "Coolman",
                    "dateOfBirth": null,
                    "family": [
                        {
                            "firstName": "Child B",
                            "lastName": "Coolman",
                            "dateOfBirth": null,
                            "family": []
                        }
                    ]
                }
            ]
        };

        expect(data).toEqual(expected);

    });


    test('format recursive object', async () => {
        class StaffMember extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()
            supervisor = Recursive(StaffMember, { required: false })
        }

        const data = await new StaffMember({}).format({
            firstName: 'Robert',
            lastName: 'S',
            supervisor: {
                firstName: 'Matt',
                lastName: 'X',
                supervisor: {
                    firstName: 'Pat',
                    lastName: 'X'
                }
            }
        });

        const expected = {
            "firstName": "Robert",
            "lastName": "S",
            "supervisor": {
                "firstName": "Matt",
                "lastName": "X",
                "supervisor": {
                    "firstName": "Pat",
                    "lastName": "X",
                    "supervisor": {
                        "firstName": null,
                        "lastName": null,
                        "supervisor": null
                    }
                }
            }
        };

        expect(data).toEqual(expected);
    });

    test('format should use decorated function', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()

            @Format()
            fullName(obj) {
                return `${obj.firstName} ${obj.lastName}`;
            }
        }

        const data = await new Person({}).format({
            firstName: 'Steve',
            lastName: 'Coolman',
        });

        expect(data).toEqual({ firstName: 'Steve', lastName: 'Coolman', fullName: 'Steve Coolman' });
    });

    test('format should use decorated function w/ custom field name', async () => {
        class Person extends DTObject {
            firstName = StringField.bind()
            lastName = StringField.bind()

            @Format({ fieldName: 'completeName' })
            fullName(obj) {
                return `${obj.firstName} ${obj.lastName}`;
            }
        }

        const data = await new Person({}).format({
            firstName: 'Steve',
            lastName: 'Coolman',
        });

        expect(data).toEqual({ firstName: 'Steve', lastName: 'Coolman', completeName: 'Steve Coolman' });
    });
});
