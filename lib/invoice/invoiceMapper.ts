import { BusinessSchema } from "@/schema/business";
import { Client } from "@/schema/client";

export function mapBusinessSnapshot(business: BusinessSchema) {
  return {
    name: business.name,
    email: business.email,
    phone: business.phone,
    taxId: business.taxId,
    addressLine: business.address.addressLine1,
    city: business.address.city,
    state: business.address.state,
    postalCode: business.address.postalCode,
    country: business.address.country,
  };
}

export function mapClientSnapshot(client: Client) {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    taxId: client.taxId,
    address: client.address,
  };
}