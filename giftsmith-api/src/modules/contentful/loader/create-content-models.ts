import { LoaderOptions } from "@medusajs/framework/types";
import { asValue } from "awilix";
import { createClient } from "contentful-management";
import { MedusaError } from "@medusajs/framework/utils";
import {
  productContentType,
  productVariantContentType,
  productOptionContentType,
  productOptionValueContentType,
  bannerItemContentType,
  bannerGroupContentType,
  bannerTemplateContentType,
} from "../content-types";

const { createClient: createDeliveryClient } = require("contentful");

export type ModuleOptions = {
  management_access_token: string;
  delivery_token: string;
  space_id: string;
  environment: string;
  default_locale?: string;
};

export default async function syncContentModelsLoader({
  container,
  options,
}: LoaderOptions<ModuleOptions>) {
  if (
    !options?.management_access_token ||
    !options?.delivery_token ||
    !options?.space_id ||
    !options?.environment
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Contentful access token, space ID and environment are required"
    );
  }

  const logger = container.resolve("logger");

  try {
    const managementClient = createClient(
      {
        accessToken: options.management_access_token,
      },
      {
        type: "plain",
        defaults: {
          spaceId: options.space_id,
          environmentId: options.environment,
        },
      }
    );

    const deliveryClient = createDeliveryClient({
      accessToken: options.delivery_token,
      space: options.space_id,
      environment: options.environment,
    });

    // Create content types if they don't exist
    const contentTypes = [
      { id: "product", type: productContentType },
      { id: "productVariant", type: productVariantContentType },
      { id: "productOption", type: productOptionContentType },
      { id: "productOptionValue", type: productOptionValueContentType },
      { id: "bannerItem", type: bannerItemContentType },
      { id: "bannerGroup", type: bannerGroupContentType },
      { id: "bannerTemplate", type: bannerTemplateContentType },
    ];

    for (const { id, type } of contentTypes) {
      try {
        await managementClient.contentType.get({
          contentTypeId: id,
        });
      } catch (error) {
        const contentType = await managementClient.contentType.createWithId(
          {
            contentTypeId: id,
          },
          type
        );

        await managementClient.contentType.publish(
          {
            contentTypeId: id,
          },
          contentType
        );
      }
    }

    // Register clients in container
    container.register({
      contentfulManagementClient: asValue(managementClient),
      contentfulDeliveryClient: asValue(deliveryClient),
    });

    logger.info("Connected to Contentful");
  } catch (error) {
    logger.error(`Failed to connect to Contentful: ${error}`);
    throw error;
  }
}
