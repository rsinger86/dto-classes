import { DTObject } from "./src/dt-object";
import { ArrayField } from "./src/fields/array-field";
import { BooleanField } from "./src/fields/boolean-field";
import { DateTimeField } from "./src/fields/date-time-field";
import { StringField } from "./src/fields/string-field";
import { CombineField } from "./src/fields/combine-field";
import { NumberField } from "./src/fields/number-field";


class UserDto extends DTObject {
    name = StringField.bind()
    nickName = StringField.bind({ required: false })
    birthday = DateTimeField.bind()
    active = BooleanField.bind({ default: true })
    hobbies = ArrayField.bind({ items: StringField.bind() })
    favoriteColor = StringField.bind({ allowNull: true })
}

async function t() {
    const userDto = await UserDto.parse({
        name: "Michael Scott",
        birthday: '1962-08-16',
        hobbies: ["Comedy", "Paper"],
        favoriteColor: "Red"
    });

    userDto.name
    userDto.nickName
    userDto.birthday
    userDto.active
    userDto.hobbies
    userDto.favoriteColor

    class InventoryItem extends DTObject {
        quantity = CombineField.bind({
            anyOf: [
                NumberField.bind({ minValue: 1, maxValue: 10 }),
                NumberField.bind({ minValue: 50, maxValue: 100 })
            ]
        })
    }

}
