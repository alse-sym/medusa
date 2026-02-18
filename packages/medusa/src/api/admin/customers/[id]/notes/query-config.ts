export const defaultAdminCustomerNoteFields = [
  "id",
  "customer_id",
  "body",
  "is_internal",
  "author_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveNoteTransformQueryConfig = {
  defaults: defaultAdminCustomerNoteFields,
  isList: false,
}

export const listNotesTransformQueryConfig = {
  ...retrieveNoteTransformQueryConfig,
  isList: true,
}
