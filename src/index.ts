import { Format } from "./decorators";
import { DTObject } from "./dt-object";
import { ArrayField } from "./fields/array-field";
import { BooleanField } from "./fields/boolean-field";
import { DateTimeField } from "./fields/date-time-field";
import { StringField } from "./fields/string-field";
import { Recursive } from "./recursive";



class UserDto extends DTObject {
    firstName = StringField.bind()
    lastName = StringField.bind()
    joinedAt = DateTimeField.bind({ readOnly: true })
    active = BooleanField.bind({ default: true })
    hobbies = ArrayField.bind({ items: StringField.bind(), required: true })
    favoriteColor = StringField.bind({ allowNull: true })
}

const userDto = UserDto.parseNew({})

userDto.firstName
userDto.lastName
userDto.joinedAt
userDto.active
userDto.hobbies
userDto.favoriteColor

