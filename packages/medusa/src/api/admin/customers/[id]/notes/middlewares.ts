import * as QueryConfig from "./query-config"
import {
  AdminCustomerNotesParams,
  AdminCustomerNoteParams,
  CreateCustomerNote,
} from "./validators"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

export const adminCustomerNoteRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/customers/:id/notes",
    middlewares: [
      validateAndTransformQuery(
        AdminCustomerNotesParams,
        QueryConfig.listNotesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/notes",
    middlewares: [
      validateAndTransformBody(CreateCustomerNote),
      validateAndTransformQuery(
        AdminCustomerNoteParams,
        QueryConfig.retrieveNoteTransformQueryConfig
      ),
    ],
  },
]
