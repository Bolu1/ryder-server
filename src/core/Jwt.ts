import jwt, { VerifyOptions } from 'jsonwebtoken';

class Jwt {
	public static issue(payload: any, expires:any = 1): string {
		return  jwt.sign(
			payload,
			process.env.SECERET_KEY,
			{ expiresIn: "30d" }
		  );
	}

	public static verify(
		token: string,
	): any {
		return jwt.verify(token, process.env.SECERET_KEY)
	}
}

export default Jwt;