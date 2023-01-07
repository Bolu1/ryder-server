import {object, string, TypeOf} from 'zod'

export const createUserSchema = object({
    body: object({
        email:string({
            required_error:'email is  required'
        }).email('Not a valid email'),
        password:string({
            required_error:'password is  required'
        }).min(6, "Password too short "),
        name:string({
            required_error:'Name is  required'
        }),
       phone:string({
           required_error:'Phone number is required'
       }),
       rc:string({
           required_error:'RC number is required'
       }),
       type:string({
        required_error:'Type is required'
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