import { z } from "@medusajs/framework/zod"
import {
  createFindParams,
  createSelectParams,
} from "../../../../utils/validators"

export const AdminCustomerNoteParams = createSelectParams()

export const AdminCustomerNotesParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    author_id: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export const CreateCustomerNote = z.object({
  body: z.string().min(1).max(5000),
  is_internal: z.boolean().optional().default(true),
  metadata: z.record(z.unknown()).nullish(),
})

export type AdminCustomerNotesParamsType = z.infer<
  typeof AdminCustomerNotesParams
>
export type AdminCreateCustomerNoteType = z.infer<typeof CreateCustomerNote>
