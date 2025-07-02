export interface ContentTypeDefinition {
  name: string;
  description: string;
  displayField: string;
  fields: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
    localized: boolean;
    [key: string]: any;
  }>;
} 