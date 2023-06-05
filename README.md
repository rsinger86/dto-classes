# Introduction

DTO Classes is a TypeScript library for modelling data transfer objects in HTTP JSON APIs.

It gives you the following, a bundle I've found missing for TypeScript/Node:
- Class-based schemas that serialize *and* deserialize:
  - Parse/validate JSON to internal objects
  - Format internal objects to JSON
- Static types by default without an additional `infer` call
- Custom validation by adding methods to a schema class
- Simple way to access additional context (eg the request object) when parsing
- Async parsing & formatting to play nice with ORMs
- An API broadly similar to OpenAPI and JSON Schema

Example:

```typescript
import { DTObject, ArrayField, BooleanField, StringField, DateTimeField } from "dto-classes";

class UserDto extends DTObject {
    firstName = StringField.bind()
    lastName = StringField.bind()
    nickName = StringField.bind({ required: false })
    birthday = DateTimeField.bind()
    active = BooleanField.bind({ default: true })
    hobbies = ArrayField.bind({ items: StringField.bind() })
    favoriteColor = StringField.bind({ allowNull: true })
}

const userDto = await UserDto.parse({
    firstName: "Michael",
    lastName: "Scott",
    birthday: '1962-08-16',
    hobbies: ["Comedy", "Paper"],
    favoriteColor: "Red"
});
```

VS Code:

![Alt Text](vs-code-demo-1.gif)

# Table of Contents

<!-- TOC -->

- [Introduction](#introduction)
- [Installation](#installation)
    - [From npm](#from-npm)
    - [Config](#config)
- [Basic Usage](#basic-usage)
    - [Parsing & Validating Objects](#parsing--validating-objects)
    - [Formatting Objects](#formatting-objects)
- [Fields](#fields)
    - [StringField: string](#stringfield-string)
    - [BooleanField: boolean](#booleanfield-boolean)
    - [NumberField: number](#numberfield-number)
    - [DateTimeField: Date](#datetimefield-date)
    - [ArrayField: Array<T>](#arrayfield-arrayt)
    - [Nested Objects: DTObject](#nested-objects-dtobject)
- [Error Handling](#error-handling)
- [Custom Parsing/Validation](#custom-parsingvalidation)
- [Custom Formatting](#custom-formatting)
- [Recursive Objects](#recursive-objects)
- [Standalone Fields](#standalone-fields)
- [NestJS](#nestjs)
    - [Simple Validation Pipe](#simple-validation-pipe)
    - [Validation Pipe with Request Context](#validation-pipe-with-request-context)

<!-- /TOC -->

# Installation

TypeScript 4.5+ is required. 

## From npm
```npm install dto-classes```

## Config
You'll get more accurate type hints with `strict` set to `true` in your `tsconfig.json`:
```jsonc
{
  "compilerOptions": {
    // ...
    "strict": true
    // ...
}
```

If that's not practical, you'll still get useful type hints by setting `strictNullChecks` to `true`:
```jsonc
{
  "compilerOptions": {
    // ...
    "strictNullChecks": true
    // ...
}
```

# Basic Usage

The library handles both _parsing_, the process of transforming inputs to the most relevant types, and _validating_, the process of ensuring values meet the correct criteria.

This aligns with the [robustness principle](https://en.wikipedia.org/wiki/Robustness_principle). When consuming an input for an age field, most applications will want the string `"25"` auto-converted to the number `25`. However, you can override this default behavior with your own custom `NumberField`.

## Parsing & Validating Objects

Let's start by defining some schema classes. Extend the `DTObject` class and define its fields:

```typescript
import { DTObject, StringField, DateTimeField } from 'dto-classes';

class DirectorDto extends DTObject {
    name = StringField.bind()
}

class MovieDto extends DTObject {
    title = StringField.bind()
    releaseDate = DateTimeField.bind()
    director = DirectorDto.bind(),
    genre = StringField.bind({required: false})
}
```

There's some incoming data:
```typescript
const data = {
    "title": "The Departed",
    "releaseDate": '2006-10-06',
    "director": {"name": "Martin Scorsese"}
}
```

We can coerce and validate the data by calling the static method `parse(data)` which will return a newly created DTO instance:

```typescript
const movieDto = await MovieDto.parse(data);
```

If it succeeds, it will return a strongly typed instance of the class. If it fails, it will raise a validation error:

```typescript
import { ParseError } from "dto-classes";

try {
    const movieDto = await MovieDto.parse(data);
} catch (error) {
    if (error instanceof ParseError) {
        // 
    }
}
```

For incoming `PATCH` requests, the convention is to make all fields optional, even if they'd otherwise be required. 

You can pass `partial: true` for validation to succeed in these scenarios:

```typescript
const data = {
    "releaseDate": '2006-10-06'
}

const movieDto = await MovieDto.parse(data, {partial: true});
```

## Formatting Objects

You can also format internal data types to JSON data that can be returned in an HTTP response.

A common example is model instances originating from an ORM:

```typescript
const movie = await repo.fetchMovie(45).join('director')
const jsonData = await MovieDto.format(movie);
return HttpResponse(jsonData);
```

Special types, like JavaScript's Date object, will be converted to JSON compatible output:
```json
{
    "title": "The Departed",
    "releaseDate": "2006-10-06",
    "director": {"name": "Martin Scorsese"}
}
```

Any internal properties not specified will be ommitted from the formatted output.

# Fields

Fields handle converting between primitive values and internal datatypes. They also deal with validating input values. They are attached to a `DTObject` using the `bind(options)` static method. 

All field types accept some core options:

```typescript
interface BaseFieldOptions {
    required?: boolean;  
    allowNull?: boolean;
    readOnly?: boolean;  
    writeOnly?: boolean; 
    default?: any;
    partial?: boolean;
    formatSource?: string;
    ignoreInput?: boolean;
    context?: {[key: string]: any};
}
```

| Option      | Description                         | Default |
| ----------- | ---------------------------------- |  ------- |
| required    | Whether an input value is required | true |
| allowNull   | Whether null input values are allowed | false |
| readOnly    | If true, any input value is ignored during parsing, but is included in the output format | false |
| writeOnly   | If true, the field's value is excluded from the formatted output, but is included in parsing | false |
| default     | The default value to use during parsing if none is present in the input | n/a |
| formatSource  | The name of the attribute that will be used to populate the field, if different from the formatted field name name | n/a  |
| ignoreInput  | Whether to always return the provided `default` when parsing and ignore the user-provider input. | false  |
| context  | A container for additional data that'd be useful during parsing or formatting. A common scenario is to pass in an HTTP request object. | n/a  |

## StringField: `string`

- Parses input to _strings_. Coerces numbers, other types invalid. 
- Formats all value types to _strings_.

```typescript
interface StringOptions extends BaseFieldOptions {
    allowBlank?: boolean;
    trimWhitespace?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp,
    format?: 'email' | 'url'
}
```
| Option      | Description                         | Default |
| ----------- | ---------------------------------- |  ------- |
| allowBlank    | If set to true then the empty string should be considered a valid value. If set to false then the empty string is considered invalid and will raise a validation error. | false |
| trimWhitespace   | If set to true then leading and trailing whitespace is trimmed.  | true |
| maxLength    | Validates that the input contains no more than this number of characters. | n/a |
| minLength   | Validates that the input contains no fewer than this number of characters. | n/a |
| pattern     | A `Regex` that the input must match or a ParseError will be thrown. | n/a |
| format  | A predefined format that the input must conform to or a ParseError will be thrown. Supported values: `email`, `url`. | n/a  |

## BooleanField: `boolean`

- Parses input to _booleans_. Coerces certain bool-y strings. Other types invalid.
- Formats values to _booleans_.

Truthy inputs:
```typescript
['t', 'T', 'y', 'Y', 'yes', 'Yes', 'YES', 'true', 'True', 'TRUE', 'on', 'On', 'ON', '1', 1, true]
```

Falsey inputs:
```typescript
['f', 'F', 'n', 'N', 'no', 'No', 'NO', 'false', 'False', 'FALSE', 'off', 'Off', 'OFF', '0', 0, 0.0, false]
```

## NumberField: `number`

- Parses input to _numbers_. Coerces numeric strings. Other types invalid.
- Formats values to _numbers_.

```typescript
interface NumberOptions extends BaseFieldOptions {
    maxValue?: number;
    minValue?: number;
}
```

| Option      | Description                         | Default |
| ----------- | ---------------------------------- |  ------- |
| maxValue   | Validate that the number provided is no greater than this value. | n/a |
| minValue   | Validate that the number provided is no less than this value. | n/a |



## DateTimeField: `Date`

- Parses input to _`Date` instances_. Coercing date-ish strings using `Date.parse()`. 
- Formats values to _strings_ with `Date.toISOString()`.

```typescript
interface DateTimeFieldOptions extends BaseFieldOptions {
    maxDate?: Date;
    minDate?: Date;
}
```

| Option      | Description                                                  | Default |
| ----------- | ---------------------------------------------------------------- | --- |
| maxDate   | Validate that the date provided is no later than this date. | n/a |
| minDate   | Validate that the date provided is no earlier than this date.    | n/a |


## ArrayField: `Array<T>`

- Parses and formats a list of fields or nested objects.

```typescript
interface ArrayOptions extends BaseFieldOptions {
    items: BaseField | DTObject;
    maxLength?: number;
    minLength?: number;
}
```

| Option      | Description                                                  | Default |
| ----------- | ---------------------------------------------------------------- | --- |
| items   | A bound field or object | n/a |
| maxLength   | Validates that the array contains no fewer than this number of elements. | n/a |
| minLength   | Validates that the list contains no more than this number of elements.    | n/a |


Examples:

```typescript
class ActionDto extends DTObject {
    name = String.bind()
    timestamp = DateTimeField.bind()
}

class UserDto extends DTObject {
    actions = ArrayField.bind({ items: ActionDto.bind() })
    emailAddresses = ArrayField.bind({ items: StringField.bind() })
}
```

## Nested Objects: `DTObject`

`DTObject` classes can be nested under parent `DTObject` classes and configured with the same core `BaseFieldOptions`:

```typescript
import { DTObject, StringField, DateTimeField } from 'dto-classes';


class Plot extends DTObject {
    content: StringField.bind()
}

class MovieDto extends DTObject {
    title = StringField.bind()
    plot = Plot.bind({required: false, allowNull: true})
}
```

# Error Handling

If parsing fails for any reason -- the input data could not be parsed or a validation constraint failed -- a `ParseError` is thrown.

The error can be inspected:

```typescript
class ParseError extends Error {
  issues: ValidationIssue[];
}

interface ValidationIssue {
    path: string[]; // path to the field that raised the error
    message: string; // English description of the problem
}
```

Example:
```typescript
import { ParseError } from "dto-classes";


class DirectorDto extends DTObject {
    name = StringField.bind()
}

class MovieDto extends DTObject {
    title = StringField.bind()
    director = DirectorDto.bind(),
}

try {
    const movieDto = await MovieDto.parse({
        title: 'Clifford', 
        director: {}
    });
} catch (error) {
    if (error instanceof ParseError) {
        console.log(error.issues);
        /* [
            {
                "path": ["director", "name"],
                "message": "This field is required"
            }
        ] */
    }
}

```

# Custom Parsing/Validation

For custom validation and rules that must examine the whole object, methods can be added to the `DTObject` class.

To run the logic after coercion, use the `@AfterParse` decorator.

```typescript
import { AfterParse, BeforeParse, ParseError } from "dto-classes";

class MovieDto extends DTObject {
    title = StringField.bind()
    director = DirectorDto.bind()

    @AfterParse()
    rejectBadTitles() {
        if (this.title == 'Yet Another Superhero Movie') {
            throw new ParseError('No thanks');
        }
    }
}
```

The method can modify the object as well:

```typescript
import { AfterParse, BeforeParse, ParseError } from "dto-classes";

class MovieDto extends DTObject {
    title = StringField.bind()
    director = DirectorDto.bind()

    @AfterParse()
    makeTitleExciting() {
        this.title = this.title + '!!';
    }
}
```

# Custom Formatting

Override the static `format` method to apply custom formatting.

```typescript
import { AfterParse, BeforeParse, ParseError } from "dto-classes";

class MovieDto extends DTObject {
    title = StringField.bind()
    director = DirectorDto.bind()

    static format(value: any) {
        const formatted = super.format(value);
        formatted['genre'] = formatted['director']['name'].includes("Mike Judge") ? 'comedy' : 'drama';
        return formatted;
    }
}
```

A nicer way to expose computed values is to use the `@Format` decorator. The single argument (e.g. "obj") will always be 
the full object initially passed to the static `format()` method:

```typescript
class Person extends DTObject {
    firstName = StringField.bind()
    lastName = StringField.bind()

    @Format()
    fullName(obj: any) {
        return `${obj.firstName} ${obj.lastName}`;
    }
}

const formattedData = await Person.format({
    firstName: 'George',
    lastName: 'Washington',
});

expect(formattedData).toEqual({ 
    firstName: 'George', 
    lastName: 'Washington', 
    fullName: 'George Washington' 
});
```

You can customize the formatted field name by passing `{fieldName: string}` to the decorator:

```typescript
class Person extends DTObject {
    firstName = StringField.bind()
    lastName = StringField.bind()

    @Format({fieldName: 'fullName'})
    makeFullName(obj: any) {
        return `${obj.firstName} ${obj.lastName}`;
    }
}

/*
{ 
    firstName: 'George', 
    lastName: 'Washington', 
    fullName: 'George Washington' 
}
*/
```

# Recursive Objects

To prevent recursion errors (eg "Maximum call stack size exceeded"), wrap nested self-refrencing objects in a `Recursive` call:

```typescript
import { ArrayField, Rescursive } from "dto-classes";

class MovieDto extends DTObject {
    title = StringField.bind()
    director = DirectorDto.bind()
    sequels: ArrayField({items: Recursive(MovieDto)})
}
```

# Standalone Fields

It's possible to use fields outside of `DTObject` schemas:

```typescript
import { DateTimeField } from "dto-classes";

const pastOrPresentday = DateTimeField.parse('2022-12-25', {maxDate: new Date()});
```

You can also create re-usable field schemas by calling the instance method `parseValue()`:

```typescript
const pastOrPresentSchema = new DateTimeField({maxDate: new Date()});

pastOrPresentSchema.parseValue('2021-04-16');
pastOrPresentSchema.parseValue('2015-10-23');
```

# NestJS

`DTObject` classes can integrate easily with NestJS global pipes. 

Two ready-to-use examples are included.

## Simple Validation Pipe

Copy the pipe in [nestjs-examples/dto-validation-pipe.ts](nestjs-examples/dto-validation-pipe.ts) to your project.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new DTOValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

## Validation Pipe with Request Context

To implement more complex validation it's often useful to be able to access the current HTTP request object. For example, knowing the current user could affect whether validation succeeds. Or maybe you want to implement a hidden field that always returns the current user.

Copy the pipe in [nestjs-examples/dto-context-validation-pipe.ts](nestjs-examples/dto-context-validation-pipe.ts) to your project.

Each request will construct its own pipe with the current request object so the pipe must be configured as a provider:

```typescript
@Module({
  imports: [
    UsersModule
  ],
  controllers: [],
  providers: [
    {
        provide: APP_PIPE,
        useClass: DTOContextValidationPipe,
    }
  ],
})
export class AppModule { }
```

You can now easily set up a hidden input field that always returns the authenticated user of the request:

```typescript
import { BaseField, BaseFieldOptions, ParseReturnType } from 'dto-classes';
import { User } from 'path-to-entities/user.entity';


export class CurrentUserField<T extends BaseFieldOptions> extends BaseField {
    _options: T;

    constructor(options?: T) {
        super(options);
        this._options.ignoreInput = true;
    }

    public async parseValue(value: any): ParseReturnType<User, T> {
        return this.getDefaultParseValue();
    }

    async getDefaultParseValue(): Promise<any> {
        const user = await this._context.request.fetchUser();
        return user;
    }
}

```
