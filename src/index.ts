import { Format } from "./decorators";
import { DTObject } from "./dt-object";
import { ArrayField } from "./fields/array-field";
import { StringField } from "./fields/string-field";
import { Recursive } from "./recursive";



class Person extends DTObject {
    firstName = StringField.bind()
    lastName = StringField.bind()
    family = ArrayField.bind({ items: Recursive(Person) })

    @Format({ fieldName: 'fullName' })
    getFullName(object) {
        return 'hi'
    }
}

const schema = new Person({})

const data = schema.format({
    firstName: 'Mr',
    lastName: 'Hotmire',
    family: []
})

console.log(JSON.stringify(data, null, 2));