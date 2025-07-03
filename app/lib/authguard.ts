import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { ENV } from "@/util";
import UserModel from "./user";


export const verifyUser = async () => {
	const token = (await cookies()).get("token")
	if (!token) redirect("/login")
	// let userId: string | undefined

	try {
		const payload = jwt.verify(token.value, ENV("JWT_SECRET")) as {
			_id: string
            firstname: string
		}

		// userId = payload._id

		return await UserModel.findById(payload._id)
        
	} catch (error) {
		console.log(error)
		redirect("/login")
	}


}