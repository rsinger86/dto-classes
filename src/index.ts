import { DTObject } from "./fields/dt-object";
import { EmailField } from "./fields/email-field";
import { StringField } from "./fields/string-field";

console.log('Hello world!!')

class Person extends DTObject {
    firstName = StringField.bind()
    email = EmailField.bind({ required: true })
}

const person = new Person({}).parse({ firstName: 'Robert', lastName: 'Singer' });

console.log(person.firstName)
console.log(person.email)
