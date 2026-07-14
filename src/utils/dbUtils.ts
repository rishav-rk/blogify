import bcrypt from "bcrypt"

const hashPassword = async (password:string) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

const comparePassword = async (password: string, encryptedPassword: string) => {
    return await bcrypt.compare(password, encryptedPassword)
}

const tokenUserSelection = {
    id : true, 
    name: true, 
    image: true,
    email: true, 
    createdAt: true, 
    isDeleted: true,
    isActive: true,

}

export { hashPassword, comparePassword, tokenUserSelection }
