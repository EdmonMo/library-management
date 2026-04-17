import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

async function main() {
  console.log("Start seeding...")

  const password = await hash("123123123", 12)

  // ============================================
  // 1. CREATE 3 USERS (1 Admin, 1 Employee, 1 Student)
  // ============================================
  const usersData = [
    {
      name: "مدير المكتبة",
      email: "admin@library.com",
      password: password,
      role: "ADMIN" as const,
      department: "Library Administration",
      phone: "+1234567890",
    },
    {
      name: "موظف المكتبة",
      email: "employee@library.com",
      password: password,
      role: "EMPLOYEE" as const,
      department: "Circulation Desk",
      phone: "+1234567891",
    },
    {
      name: "طالب",
      email: "student@library.com",
      password: password,
      role: "STUDENT" as const,
      studentId: "STU2024001",
      department: "Computer Science",
      phone: "+1234567892",
    },
  ]

  const createdUsers = []
  for (const userData of usersData) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {}, // Don't update existing users
      create: userData,
    })
    createdUsers.push(user)
    console.log(`✅ Created/Ensured user: ${user.name} (${user.role})`)
  }

  // ============================================
  // 2. CREATE AUTHORS
  // ============================================
  const authorsData = [
    {
      name: "Harper Lee",
      biography: "American novelist known for To Kill a Mockingbird",
    },
    { name: "George Orwell", biography: "English novelist and critic" },
    {
      name: "Jane Austen",
      biography: "English novelist known for her six major novels",
    },
    {
      name: "F. Scott Fitzgerald",
      biography: "American novelist and short story writer",
    },
    { name: "Paulo Coelho", biography: "Brazilian lyricist and novelist" },
    { name: "Khaled Hosseini", biography: "Afghan-American novelist" },
    { name: "Frank Herbert", biography: "American science fiction writer" },
    { name: "J.R.R. Tolkien", biography: "English writer and philologist" },
    {
      name: "J.K. Rowling",
      biography: "British author of Harry Potter series",
    },
    { name: "Yuval Noah Harari", biography: "Israeli historian and professor" },
    { name: "Michelle Obama", biography: "American attorney and author" },
    { name: "Dan Brown", biography: "American thriller writer" },
    { name: "Agatha Christie", biography: "English mystery writer" },
    { name: "Andy Weir", biography: "American novelist" },
    { name: "Gillian Flynn", biography: "American author and screenwriter" },
  ]

  const createdAuthors = []
  for (const authorData of authorsData) {
    const author = await prisma.author.upsert({
      where: { name: authorData.name },
      update: {},
      create: authorData,
    })
    createdAuthors.push(author)
    console.log(`✅ Created/Ensured author: ${author.name}`)
  }

  // ============================================
  // 3. CREATE CATEGORIES
  // ============================================
  const categoriesData = [
    { name: "Classic Literature", description: "Enduring literary works" },
    {
      name: "Dystopian",
      description: "Speculative fiction exploring social structures",
    },
    { name: "Romance", description: "Love and relationship focused stories" },
    { name: "Adventure", description: "Exciting journeys and quests" },
    {
      name: "Historical Fiction",
      description: "Fictional stories set in historical periods",
    },
    { name: "Thriller", description: "Suspenseful and fast-paced" },
    {
      name: "Science Fiction",
      description: "Futuristic and speculative concepts",
    },
    { name: "Fantasy", description: "Magical and imaginary worlds" },
    { name: "Mystery", description: "Crime and detective stories" },
    { name: "Non-Fiction", description: "Factual and informative" },
    { name: "Biography", description: "Life stories of real people" },
    { name: "Young Adult", description: "Literature for young readers" },
  ]

  const createdCategories = []
  for (const categoryData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    })
    createdCategories.push(category)
    console.log(`✅ Created/Ensured category: ${category.name}`)
  }

  // ============================================
  // 4. CREATE 20 BOOKS with relationships
  // ============================================
  const booksData = [
    {
      title: "To Kill a Mockingbird",
      isbn: "9780061120084",
      description:
        "The story of racial injustice and loss of innocence in the American South.",
      publisher: "HarperCollins",
      publishedYear: 1960,
      authors: ["Harper Lee"],
      categories: ["Classic Literature", "Historical Fiction"],
      copies: 3,
    },
    {
      title: "1984",
      isbn: "9780451524935",
      description:
        "A dystopian social science fiction novel about totalitarianism.",
      publisher: "Signet Classics",
      publishedYear: 1949,
      authors: ["George Orwell"],
      categories: ["Dystopian", "Classic Literature", "Science Fiction"],
      copies: 4,
    },
    {
      title: "Pride and Prejudice",
      isbn: "9780141439518",
      description: "A romantic novel of manners centered on Elizabeth Bennet.",
      publisher: "Penguin Classics",
      publishedYear: 1813,
      authors: ["Jane Austen"],
      categories: ["Classic Literature", "Romance"],
      copies: 2,
    },
    {
      title: "The Great Gatsby",
      isbn: "9780743273565",
      description:
        "The story of mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.",
      publisher: "Scribner",
      publishedYear: 1925,
      authors: ["F. Scott Fitzgerald"],
      categories: ["Classic Literature"],
      copies: 3,
    },
    {
      title: "The Alchemist",
      isbn: "9780062502174",
      description: "A philosophical story about following your dreams.",
      publisher: "HarperOne",
      publishedYear: 1988,
      authors: ["Paulo Coelho"],
      categories: ["Adventure", "Fantasy"],
      copies: 4,
    },
    {
      title: "The Kite Runner",
      isbn: "9781594631931",
      description:
        "Story of friendship, betrayal, and redemption in Afghanistan.",
      publisher: "Riverhead Books",
      publishedYear: 2003,
      authors: ["Khaled Hosseini"],
      categories: ["Historical Fiction", "Young Adult"],
      copies: 3,
    },
    {
      title: "Dune",
      isbn: "9780441013593",
      description:
        "Epic science fiction set in a distant future amidst a feudal interstellar society.",
      publisher: "Ace Books",
      publishedYear: 1965,
      authors: ["Frank Herbert"],
      categories: ["Science Fiction", "Adventure"],
      copies: 3,
    },
    {
      title: "The Hobbit",
      isbn: "9780547928227",
      description: "Fantasy novel about the quest of Bilbo Baggins.",
      publisher: "Houghton Mifflin Harcourt",
      publishedYear: 1937,
      authors: ["J.R.R. Tolkien"],
      categories: ["Fantasy", "Adventure"],
      copies: 5,
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      isbn: "9780439708180",
      description: "First book in the Harry Potter series.",
      publisher: "Scholastic",
      publishedYear: 1997,
      authors: ["J.K. Rowling"],
      categories: ["Fantasy", "Young Adult"],
      copies: 6,
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      isbn: "9780062316097",
      description: "Exploration of the history of the human species.",
      publisher: "Harper",
      publishedYear: 2011,
      authors: ["Yuval Noah Harari"],
      categories: ["Non-Fiction"],
      copies: 2,
    },
    {
      title: "Becoming",
      isbn: "9781524763138",
      description: "Memoir by former First Lady Michelle Obama.",
      publisher: "Crown",
      publishedYear: 2018,
      authors: ["Michelle Obama"],
      categories: ["Biography", "Non-Fiction"],
      copies: 3,
    },
    {
      title: "The Da Vinci Code",
      isbn: "9780307474278",
      description: "Mystery thriller involving religious symbolism.",
      publisher: "Anchor Books",
      publishedYear: 2003,
      authors: ["Dan Brown"],
      categories: ["Mystery", "Thriller"],
      copies: 4,
    },
    {
      title: "And Then There Were None",
      isbn: "9780062073488",
      description:
        "Classic mystery novel about ten strangers invited to an island.",
      publisher: "William Morrow",
      publishedYear: 1939,
      authors: ["Agatha Christie"],
      categories: ["Mystery", "Thriller"],
      copies: 3,
    },
    {
      title: "The Martian",
      isbn: "9780553418026",
      description: "Astronaut stranded on Mars struggles to survive.",
      publisher: "Crown",
      publishedYear: 2011,
      authors: ["Andy Weir"],
      categories: ["Science Fiction", "Adventure"],
      copies: 4,
    },
    {
      title: "Gone Girl",
      isbn: "9780307588364",
      description: "Psychological thriller about a marriage gone wrong.",
      publisher: "Crown",
      publishedYear: 2012,
      authors: ["Gillian Flynn"],
      categories: ["Thriller", "Mystery"],
      copies: 3,
    },
    {
      title: "Foundation",
      isbn: "9780553293357",
      description:
        "First book in the Foundation series about the fall of a galactic empire.",
      publisher: "Bantam Spectra",
      publishedYear: 1951,
      authors: ["Isaac Asimov"],
      categories: ["Science Fiction", "Classic Literature"],
      copies: 2,
    },
    {
      title: "The Book Thief",
      isbn: "9780375842207",
      description: "Story of a young girl in Nazi Germany who steals books.",
      publisher: "Knopf Books",
      publishedYear: 2005,
      authors: ["Markus Zusak"],
      categories: ["Historical Fiction", "Young Adult"],
      copies: 3,
    },
    {
      title: "Life of Pi",
      isbn: "9780156027328",
      description: "Boy stranded on a lifeboat with a Bengal tiger.",
      publisher: "Harvest Books",
      publishedYear: 2001,
      authors: ["Yann Martel"],
      categories: ["Adventure", "Fantasy"],
      copies: 3,
    },
    {
      title: "Moby Dick",
      isbn: "9781503280786",
      description: "Obsessive quest of Captain Ahab for the white whale.",
      publisher: "CreateSpace",
      publishedYear: 1851,
      authors: ["Herman Melville"],
      categories: ["Classic Literature", "Adventure"],
      copies: 2,
    },
    {
      title: "The Girl with the Dragon Tattoo",
      isbn: "9780307454546",
      description: "Mystery thriller about a missing heiress and a journalist.",
      publisher: "Vintage Crime",
      publishedYear: 2005,
      authors: ["Stieg Larsson"],
      categories: ["Mystery", "Thriller"],
      copies: 3,
    },
  ]

  // Add Isaac Asimov to authors if not already there
  if (!createdAuthors.some((a) => a.name === "Isaac Asimov")) {
    const asimov = await prisma.author.upsert({
      where: { name: "Isaac Asimov" },
      update: {},
      create: {
        name: "Isaac Asimov",
        biography: "American writer and professor of biochemistry",
      },
    })
    createdAuthors.push(asimov)
  }

  if (!createdAuthors.some((a) => a.name === "Markus Zusak")) {
    const zusak = await prisma.author.upsert({
      where: { name: "Markus Zusak" },
      update: {},
      create: { name: "Markus Zusak", biography: "Australian writer" },
    })
    createdAuthors.push(zusak)
  }

  if (!createdAuthors.some((a) => a.name === "Yann Martel")) {
    const martel = await prisma.author.upsert({
      where: { name: "Yann Martel" },
      update: {},
      create: { name: "Yann Martel", biography: "Canadian author" },
    })
    createdAuthors.push(martel)
  }

  if (!createdAuthors.some((a) => a.name === "Herman Melville")) {
    const melville = await prisma.author.upsert({
      where: { name: "Herman Melville" },
      update: {},
      create: { name: "Herman Melville", biography: "American novelist" },
    })
    createdAuthors.push(melville)
  }

  if (!createdAuthors.some((a) => a.name === "Stieg Larsson")) {
    const larsson = await prisma.author.upsert({
      where: { name: "Stieg Larsson" },
      update: {},
      create: {
        name: "Stieg Larsson",
        biography: "Swedish writer and journalist",
      },
    })
    createdAuthors.push(larsson)
  }

  // Create books with their relationships
  for (const bookData of booksData) {
    // Find author IDs
    const authorIds = bookData.authors
      .map(
        (authorName) => createdAuthors.find((a) => a.name === authorName)?.id
      )
      .filter((id) => id !== undefined)

    // Find category IDs
    const categoryIds = bookData.categories
      .map(
        (categoryName) =>
          createdCategories.find((c) => c.name === categoryName)?.id
      )
      .filter((id) => id !== undefined)

    // Create or update book
    const book = await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {
        title: bookData.title,
        description: bookData.description,
        publisher: bookData.publisher,
        publishedYear: bookData.publishedYear,
        authors: {
          set: [], // Clear existing
          connect: authorIds.map((id) => ({ id })),
        },
        categories: {
          set: [],
          connect: categoryIds.map((id) => ({ id })),
        },
      },
      create: {
        title: bookData.title,
        isbn: bookData.isbn,
        description: bookData.description,
        publisher: bookData.publisher,
        publishedYear: bookData.publishedYear,
        authors: {
          connect: authorIds.map((id) => ({ id })),
        },
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    })

    // Create book copies
    // First, check existing copies
    const existingCopies = await prisma.bookCopy.findMany({
      where: { bookId: book.id },
    })

    const existingCopyNumbers = existingCopies.map((c) => c.copyNumber)

    // Create missing copies
    for (let copyNum = 1; copyNum <= bookData.copies; copyNum++) {
      if (!existingCopyNumbers.includes(copyNum)) {
        await prisma.bookCopy.create({
          data: {
            bookId: book.id,
            copyNumber: copyNum,
            status: "AVAILABLE",
            location: `Main Library - Section ${String.fromCharCode(64 + Math.ceil(copyNum / 10))}`,
          },
        })
        console.log(`  📚 Created copy #${copyNum} for "${book.title}"`)
      } else {
        console.log(`  📚 Copy #${copyNum} already exists for "${book.title}"`)
      }
    }

    console.log(
      `✅ Created/Ensured book: ${book.title} (${bookData.copies} copies)`
    )
  }

  // ============================================
  // 5. CREATE SOME SAMPLE RENTALS (Optional)
  // ============================================
  const studentUser = createdUsers.find((u) => u.role === "STUDENT")
  const availableCopies = await prisma.bookCopy.findMany({
    where: { status: "AVAILABLE" },
    take: 3,
  })

  if (studentUser && availableCopies.length > 0) {
    const today = new Date()
    const dueDate = new Date()
    dueDate.setDate(today.getDate() + 14) // 14 days loan period

    for (const copy of availableCopies.slice(0, 2)) {
      const existingRental = await prisma.rental.findFirst({
        where: {
          bookCopyId: copy.id,
          studentId: studentUser.id,
          status: "ACTIVE",
        },
      })

      if (!existingRental) {
        await prisma.rental.create({
          data: {
            bookCopyId: copy.id,
            studentId: studentUser.id,
            dueDate: dueDate,
            status: "ACTIVE",
            notes: "Sample rental from seed",
          },
        })
        console.log(
          `📖 Created sample rental for student: ${studentUser.name} - Copy ${copy.copyNumber}`
        )

        // Update copy status
        await prisma.bookCopy.update({
          where: { id: copy.id },
          data: { status: "RENTED" },
        })
      }
    }
  }

  // ============================================
  // SUMMARY
  // ============================================
  const finalUserCount = await prisma.user.count()
  const finalAuthorCount = await prisma.author.count()
  const finalCategoryCount = await prisma.category.count()
  const finalBookCount = await prisma.book.count()
  const finalCopyCount = await prisma.bookCopy.count()
  const finalRentalCount = await prisma.rental.count()

  console.log("\n🎉 Seeding completed successfully!")
  console.log("=".repeat(50))
  console.log(`📊 Summary:`)
  console.log(`  👥 Users: ${finalUserCount}`)
  console.log(`  ✍️  Authors: ${finalAuthorCount}`)
  console.log(`  📚 Categories: ${finalCategoryCount}`)
  console.log(`  📖 Books: ${finalBookCount}`)
  console.log(`  📕 Book Copies: ${finalCopyCount}`)
  console.log(`  🔄 Rentals: ${finalRentalCount}`)
  console.log("=".repeat(50))
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
