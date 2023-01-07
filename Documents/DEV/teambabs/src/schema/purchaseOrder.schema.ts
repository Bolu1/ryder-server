import {object, string, TypeOf} from 'zod'

export const createPurchaseOrder = object({
    body: object({
        seller:string({
            required_error:'seller is  required'
        }),
    })
})



export type createPurchaseOrderInput = TypeOf<typeof createPurchaseOrder>