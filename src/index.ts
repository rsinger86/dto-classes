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
    nickName = StringField.bind({ required: false })
    birthday = DateTimeField.bind()
    active = BooleanField.bind({ default: true })
    hobbies = ArrayField.bind({ items: StringField.bind() })
    favoriteColor = StringField.bind({ allowNull: true })
}

async function main() {
    const userDto = await UserDto.parseNew({
        firstName: "Michael",
        lastName: "Scott",
        birthday: '1962-08-16',
        hobbies: ["Comedy", "Paper"],
        favoriteColor: "Red"
    })



    userDto.firstName
    userDto.lastName
    userDto.nickName
    userDto.birthday
    userDto.active
    userDto.hobbies
    userDto.favoriteColor



}


