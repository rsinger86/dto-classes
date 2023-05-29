# Introduction

DTO Classes is a TypeScript-based parsing, validation and serialization library, designed primarily for data transfer objects in an HTTP JSON API.

It gives you the following, a bundle I've found missing in the TypeScript/Node ecosystem:
- Class-based schemas that parse/validate and serializes internal objects to JSON
- Fields attached to schemas as class properties
- Static types available by default without an additional `infer` call
- Custom validation by adding class methods to a schema class
- Constraints defined in a single options interface, not by chaining methods
- Async by default to play nice with ORMs within schemas

Example:

```typescript
import { Format } from "dto-classes/decorators";
import { DTObject } from "dto-classes/dt-object";
import { ArrayField } from "dto-classes/array-field";
import { StringField } from "dto-classes/string-field";
import { DateTimeField } from "dto-classes/date-time-field";


class UserDto extends DTObject {
    firstName = StringField.bind()
    lastName = StringField.bind()
    nickName = StringField.bind({ required: false })
    birthday = DateTimeField.bind()
    active = BooleanField.bind({ default: true })
    hobbies = ArrayField.bind({ items: StringField.bind() })
    favoriteColor = StringField.bind({ allowNull: true })
}

const userDto = await UserDto.parseNew({
    firstName: "Michael",
    lastName: "Scott",
    birthday: '1962-08-16',
    hobbies: ["Comedy", "Paper"],
    favoriteColor: "Red"
});
```

VS Code:

![Alt Text](vs-code-demo-1.gif)



# Installation

TypeScript 4.5+ is required. 

Run `npm install dto-classes`.

