import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { hash } from "bcryptjs"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@library.com" },
  })

  if (existingAdmin) {
    console.log("Admin user already exists")
    return
  }

  const hashedPassword = await hash("123123123", 12)

  await prisma.user.create({
    data: {
      name: "مدير المكتبة",
      email: "admin@library.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("Admin user created: admin@library.com / 123123123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
