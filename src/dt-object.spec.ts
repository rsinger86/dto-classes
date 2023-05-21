import { DTObject } from "./dt-object";
import { EmailField } from "./fields/email-field";
import { StringField } from "./fields/string-field";

describe('test', () => {
    test('should allow blank', async () => {
        return;
        class Person extends DTObject {
            firstName = StringField.bind()
            email = EmailField.bind({ required: true })
        }

        const person = new Person({}).parse({ firstName: 'Robert', lastName: 'Singer' });

        console.log(person.firstName)

    });



});
