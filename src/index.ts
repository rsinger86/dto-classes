import { DTObject } from "./dt-object";
import { EmailField } from "./fields/email-field";
import { StringField } from "./fields/string-field";


/* class AddressDTO extends DTObject {
    street = StringField.bind()
}

class PersonDTO extends DTObject {
    firstName = StringField.bind()
    email = EmailField.bind({ default: 'anon@hotmail.com' })
    address = AddressDTO.bind()
}

const person = new PersonDTO()
 */
var s = new EmailField()
s.parse('r@hotmailf.com')

/* try {
    person.parse({
        firstName: 'Robert',
        lastName: 'Singer',
        email: 'robert@hotmail.com',
        address: {
            street: 'Hillgrove'
        }
    });
} catch (e) {
    console.log(e.issues)
}

console.log(person.firstName)
console.log(person.email)
console.log(person.address.street)
 */