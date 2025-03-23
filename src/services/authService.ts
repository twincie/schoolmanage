import { AppDataSource } from "../config/ormconfig";
import User from "../entity/user";
import { comparePasswords, hashPassword } from "../utils/passwordUtils";
import { generateTokens, refreshAccessToken, verifyToken } from "../utils/jwtUtils";
import Role from "../enum/role";
import TeacherDetails from "../entity/teachersDetails";
import StudentDetails from "../entity/studentDetails";

interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

interface ValidationResponse {
  isValid: boolean;
  email?: String;
  role?: String;
}

export default class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private teacherDetailsRepository = AppDataSource.getRepository(TeacherDetails);
  private studentDetailsRepository = AppDataSource.getRepository(StudentDetails);

  async registerUser(email: string, username: string, password: string, role: string): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({ where: [{ username }] });
    if (existingUser) {
      console.log("[-] User already exists");
      return null;
    }
    if (role == null){
        role = Role.STUDENT;
    }
    const hashedPassword = await hashPassword(password);
    const newUser = this.userRepository.create({ email, username, password: hashedPassword, role });
    const savedUser = await this.userRepository.save(newUser);
    if (role == null || role == Role.STUDENT){
      const studentDetails = this.studentDetailsRepository.create({
        user: savedUser, // Link to the User entity
      });
      await this.studentDetailsRepository.save(studentDetails)
    } else if(role == Role.TEACHER) {
      const teacherDetails = this.teacherDetailsRepository.create({
        user: savedUser, // Link to the User entity
      });
      await this.teacherDetailsRepository.save(teacherDetails);
    }
    return savedUser;
  }

  async login(email: string, password: string): Promise<TokenResponse | null> {
    console.log("request: " + email);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      console.log("[-] User not found");
      return null;
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid email or password');
      return null;
    }
    // Generate both access and refresh tokens
    const tokens = generateTokens({
      userId: user.id.toString(),
      email: user.email,
      username: user.username,
      role: user.role, // Include role in the token payload
    });
    return tokens; // Returns { token, refreshToken, expiresAt }
  }


  async refreshToken(refreshToken: string): Promise<TokenResponse | null> {
    try {
      // This will generate new access and refresh tokens
      const tokens = refreshAccessToken(refreshToken);
      return tokens;
    } catch (error) {
      console.log('Invalid refresh token:', error);
      return null;
    }
  }

  async validateToken(token: string): Promise<ValidationResponse> {
    try {
      // Verify the token
      const payload = verifyToken(token);
      console.log(payload)
      // Get the user from database to ensure they still exist
      const user = await this.userRepository.findOne({ where: { id: Number(payload.userId) } });
      if (!user) {
        return { isValid: false };
      }
      // Token is valid and user exists
      return {
        isValid: true,
        email: user.email,
        role: user.role, // Include role in the validation response
      };
    } catch (error) {
      console.log('Token validation failed:', error);
      return { isValid: false };
    }
  }
}