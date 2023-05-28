import { DTObject } from "./dt-object";
import { ArrayField } from "./fields/array-field";
import { StringField } from "./fields/string-field";
import { Recursive } from "./recursive";



class Person extends DTObject {
    firstName = StringField.bind()
    lastName = StringField.bind()
    family = ArrayField.bind({ items: Recursive(Person) })
}

const schema = new Person({})

const data = schema.format({
    firstName: 'Mr',
    lastName: 'Hotmire',
    family: [{ firstName: 'Steve', lastName: 'Coolman', family: [{ firstName: 'Jake', lastName: 'Coolman', family: [{ firstName: 'Jesus' }] }] }]
})

console.log(JSON.stringify(data, null, 2));