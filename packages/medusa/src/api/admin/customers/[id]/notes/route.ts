import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
  Modules,
} from "@medusajs/framework/utils"
import { AdminCreateCustomerNoteType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "customer_note",
    variables: {
      filters: {
        customer_id: id,
        ...req.filterableFields,
      },
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: notes, metadata } = await remoteQuery(query)

  res.json({
    notes,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateCustomerNoteType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { body, is_internal, metadata } = req.validatedBody
  const noteModule = req.scope.resolve(Modules.NOTE)

  const note = await noteModule.createNotes({
    resource_id: id,
    resource_type: "customer",
    value: body,
    metadata: {
      ...metadata,
      is_internal: is_internal ?? true,
    },
    author_id: req.auth_context.actor_id,
  })

  res.status(201).json({ note })
}
