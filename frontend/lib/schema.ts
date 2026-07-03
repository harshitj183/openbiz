// Load schema from JSON file

import schema from '@/lib/schema_udyam.json';
import { UdyamSchema } from '@/types';

export function getSchema(): UdyamSchema {
  return schema as UdyamSchema;
}

export function getStep1Fields() {
  return schema.step1.fields;
}

export function getStep2Fields() {
  return schema.step2.fields;
}

export function getValidationRules() {
  return schema.validation_rules;
}

export function getApiEndpoints() {
  return schema.api_endpoints;
}
