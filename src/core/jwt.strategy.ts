import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/module/admin/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT token from the Authorization header
      secretOrKey: process.env.JWT_SECRET, // Secret key for decoding the JWT token
    });
  }

  // Validate and extract user information from the JWT payload
  async validate(payload) {
    const { id } = payload; // Extract the user ID from the JWT payload
    const user = await this.userService.findById(id); // Retrieve user details using the user ID

    // If no user is found, throw an UnauthorizedException indicating the need to log in
    if (!user) {
      throw new UnauthorizedException('Please log in first');
    }

    return user; // Return the user information obtained from the JWT payload
  }
}
