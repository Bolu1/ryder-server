import {object, string, TypeOf, number} from 'zod'

export const createUserSchema = object({
    body: object({
        email:string({
            required_error:'email is  required'
        }).email('Not a valid email'),
        name:string({
            required_error:'Name is  required'
        }),
       phone:string({
           required_error:'Phone number is required'
       })
    })
})

export const signinSchema = object({
    body: object({
        email: string({
            required_error:'email is required'
        }),
        password: string({
            required_error:'password is required'
        })
    })
})

export type createUserInput = TypeOf<typeof createUserSchema>