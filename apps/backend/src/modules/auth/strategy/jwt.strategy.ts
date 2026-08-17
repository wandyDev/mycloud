import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

const cookieTokenExtractor = (req: { headers?: { cookie?: string } }) => {
    const cookieHeader = req?.headers?.cookie;
    if (!cookieHeader) return null;

    const tokenCookie = cookieHeader
        .split(";")
        .map((chunk) => chunk.trim())
        .find((chunk) => chunk.startsWith("accessToken="));

    if (!tokenCookie) return null;
    return decodeURIComponent(tokenCookie.split("=")[1] || "");
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                cookieTokenExtractor,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey',
        });
    }

    async validate(payload: any) {
        return payload;
    }
}