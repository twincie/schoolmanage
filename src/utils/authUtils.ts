import { AppDataSource } from "../config/ormconfig";
import User from "../entity/user";

export const validatePasswordStrength = async (password: string): Promise<boolean> => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Count how many criteria are satisfied
    let criteriaCount = 0;
    if (password.length >= minLength) criteriaCount++;
    if (hasUppercase) criteriaCount++;
    if (hasLowercase) criteriaCount++;
    if (hasNumber) criteriaCount++;
    if (hasSpecialChar) criteriaCount++;
    
    return criteriaCount >= 3;
}

export const validateEmail = async (email: string): Promise<boolean> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 

export const userExistsByEmail = async (email: string): Promise<boolean> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    return !!user; // Returns true if user exists, false otherwise
};

export const userExistsByUsername = async (username: string): Promise<boolean> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });
    return !!user;
};

export const getUserById = async (id: number): Promise<User | null> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    return user;
}