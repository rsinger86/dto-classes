# Introduction

DTO Classes is a TypeScript-based parsing and validation library, designed primarily for data transfer objects in an HTTP JSON API.

It provides features that I found lacking in the TypeScript/Node ecosystem:
- Schemas based on classes that handle parsing, validating, and formatting
- Fields attached to schemas by declaring class properties
- Static types available on schemas by default without an additional `infer` call
- Apply custom validation across multiple fields by simply adding a class method
- Define field constraints in a single object, not by chaining methods

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
    joinedAt = DateTimeField.bind({readOnly: true})
    active = BooleanField.bind({default: true})
    hobbies = ArrayField.bind({items: new StringField(), required: false})
    favoriteColor = StringField.bind({allowNull: true})
}

const userDto = await UserDto.parseNew({

})

```
# Installation

TypeScript 4.5+ is required. 

Run `npm install dto-classes`.

