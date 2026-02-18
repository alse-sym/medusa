# Loyalty Points Endpoint (Demo)

This change introduces a new admin API endpoint proposal for loyalty points adjustments.

## Endpoint

- Method: `POST`
- Path: `/admin/loyalty/points/adjust`

## Request Body

- `customer_id` (string, required)
- `delta` (number, required, positive or negative)
- `reason` (string, optional)

## Response

- `id` (string)
- `customer_id` (string)
- `balance_after` (number)
- `updated_at` (ISO date string)

## Notes

- This is a documentation-driven demo artifact to test automated docs synchronization.
- Validation and auth scopes should match existing admin write patterns.

## New Query Support (v2)

- Added optional query flag: `include_history=true` to include latest adjustment history in response.
