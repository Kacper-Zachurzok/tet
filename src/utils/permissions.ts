import type { Permission } from "./schemas/permission";

const permissions = {
  AddProduct: 1 << 0,
  RemoveProduct: 1 << 1,
  EditProduct: 1 << 2,
};

const managePermissions = {
  ManageProduct:
    permissions.AddProduct |
    permissions.RemoveProduct |
    permissions.EditProduct,
};

export const hasPermissions: (
  userPermissions: Permission,
  permission: Permission
) => boolean = (userPermissions, permission) => {
  return (userPermissions & permission) == permission;
};

export default {
  ...permissions,
  ...managePermissions,
} as {
  [key in
    | keyof typeof permissions
    | keyof typeof managePermissions]: Permission;
};
