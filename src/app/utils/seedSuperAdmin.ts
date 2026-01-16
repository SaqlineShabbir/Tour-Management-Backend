import { envVars } from "../config/env";
import {
  Role,
  type AuthProvider,
  type IUser,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    // Prepare auth provider
    const authProvider: AuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    // Create super admin payload
    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVarified: true,  // Fixed: 'isVerified' not 'isVarified'
      auths: [authProvider],
    };

    // Create super admin
    const superAdmin = await User.create(payload);
    console.log("✅ Super Admin created successfully:", superAdmin.email);
    
    return superAdmin;
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
    throw error; // Re-throw to allow caller to handle it
  }
};