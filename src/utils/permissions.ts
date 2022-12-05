import { z } from "zod";

export const permissionsSchema = z.number().int().positive();

type PermissionFlagsBits = { [key: string]: number };

const Permissions: PermissionFlagsBits = {
  AddProduct: 1 << 0,
  RemoveProduct: 1 << 1,
  EditProduct: 1 << 2,
};

const ManagePermissions: PermissionFlagsBits = {
  ManageProduct:
    (Permissions.AddProduct || 0) |
    (Permissions.RemoveProduct || 0) |
    (Permissions.EditProduct || 0),
};

export default {
  ...Permissions,
  ...ManagePermissions,
} as PermissionFlagsBits;
