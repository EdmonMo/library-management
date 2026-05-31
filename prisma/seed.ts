import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

async function main() {
  console.log("بدء البذر...")

  const password = await hash("123123123", 12)

  // ============================================
  // 1. إنشاء 3 مستخدمين (مدير، موظف، طالب)
  // ============================================
  const usersData = [
    {
      name: "مدير المكتبة",
      email: "admin@library.com",
      password: password,
      role: "ADMIN" as const,
      department: "إدارة المكتبة المركزية",
      phone: "+963111111111",
    },
    {
      name: "موظف المكتبة",
      email: "employee@library.com",
      password: password,
      role: "EMPLOYEE" as const,
      department: "قسم الإعارة",
      phone: "+963222222222",
    },
    {
      name: "أحمد علي",
      email: "student@library.com",
      password: password,
      role: "STUDENT" as const,
      studentId: "STU2024001",
      department: "كلية الهندسة المعلوماتية",
      phone: "+963933333333",
    },
  ]

  const createdUsers = []
  for (const userData of usersData) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
    createdUsers.push(user)
    console.log(`✅ تم إنشاء المستخدم: ${user.name} (${user.role})`)
  }

  // ============================================
  // 2. إنشاء المؤلفين
  // ============================================
  const authorsData = [
    {
      name: "طه حسين",
      biography: "أديب وناقد مصري، عميد الأدب العربي",
    },
    {
      name: "نجيب محفوظ",
      biography: "روائي مصري حائز على جائزة نوبل للآداب",
    },
    {
      name: "جبران خليل جبران",
      biography: "شاعر وكاتب لبناني، أحد رواد المهجر",
    },
    {
      name: "غسان كنفاني",
      biography: "كاتب وصحفي فلسطيني، من أبرز أدباء المقاومة",
    },
    {
      name: "عبد الرحمن منيف",
      biography: "روائي سعودي من أصل أردني",
    },
    {
      name: "أحلام مستغانمي",
      biography: "روائية وشاعرة جزائرية",
    },
    {
      name: "إحسان عبد القدوس",
      biography: "روائي وصحفي مصري",
    },
    {
      name: "نزار قباني",
      biography: "شاعر سوري معاصر",
    },
    {
      name: "علي الوردي",
      biography: "عالم اجتماع ومؤرخ عراقي",
    },
    {
      name: "الطيب صالح",
      biography: "روائي سوداني، من أشهر كتاب الرواية العربية",
    },
    {
      name: "محمود درويش",
      biography: "شاعر فلسطيني وأحد أبرز شعراء العرب",
    },
    {
      name: "حنا مينه",
      biography: "روائي سوري من رواد الرواية العربية",
    },
    {
      name: "زكريا تامر",
      biography: "كاتب قصة قصيرة سوري",
    },
    {
      name: "صنع الله إبراهيم",
      biography: "روائي مصري معاصر",
    },
    {
      name: "واسيني الأعرج",
      biography: "روائي وأكاديمي جزائري",
    },
  ]

  const createdAuthors = []
  for (const authorData of authorsData) {
    const author = await prisma.author.upsert({
      where: { name: authorData.name },
      update: {},
      create: authorData,
    })
    createdAuthors.push(author)
    console.log(`✅ تم إنشاء المؤلف: ${author.name}`)
  }

  // ============================================
  // 3. إنشاء التصنيفات
  // ============================================
  const categoriesData = [
    { name: "أدب كلاسيكي", description: "الأعمال الأدبية الخالدة" },
    { name: "رواية", description: "قصص روائية طويلة" },
    { name: "شعر", description: "القصائد والأشعار العربية" },
    { name: "تاريخ", description: "الكتب التاريخية" },
    { name: "فلسفة", description: "الدراسات الفلسفية والفكرية" },
    { name: "علوم", description: "الكتب العلمية والمعرفية" },
    { name: "خيال علمي", description: "أدب الخيال العلمي والمستقبلي" },
    { name: "فكر سياسي", description: "الدراسات السياسية والاجتماعية" },
    { name: "سيرة ذاتية", description: "السير الذاتية والمذكرات" },
    { name: "قصة قصيرة", description: "المجموعات القصصية" },
    { name: "أدب أطفال", description: "كتب موجهة للأطفال واليافعين" },
    { name: "رحلات", description: "أدب الرحلات والمغامرات" },
  ]

  const createdCategories = []
  for (const categoryData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    })
    createdCategories.push(category)
    console.log(`✅ تم إنشاء التصنيف: ${category.name}`)
  }

  // ============================================
  // 4. إنشاء 20 كتاباً مع العلاقات
  // ============================================
  const booksData = [
    {
      title: "الأيام",
      isbn: "9789771400014",
      description:
        "سيرة ذاتية لعميد الأدب العربي طه حسين، يروي فيها قصة كفاحه منذ الطفولة حتى أصبح أحد أعلام الفكر العربي.",
      publisher: "دار المعارف",
      publishedYear: 1929,
      authors: ["طه حسين"],
      categories: ["أدب كلاسيكي", "سيرة ذاتية"],
      copies: 3,
    },
    {
      title: "اللص والكلاب",
      isbn: "9789770913071",
      description:
        "رواية عن الخيانة والثأر، تتبع حياة سعيد مهران بعد خروجه من السجن.",
      publisher: "دار الشروق",
      publishedYear: 1961,
      authors: ["نجيب محفوظ"],
      categories: ["رواية", "أدب كلاسيكي"],
      copies: 4,
    },
    {
      title: "الأجنحة المتكسرة",
      isbn: "9789953885384",
      description:
        "قصة حب مؤثرة تجمع بين الشاب جبران ومحبوبته سلمى في إطار اجتماعي رومانسي.",
      publisher: "دار النهار",
      publishedYear: 1912,
      authors: ["جبران خليل جبران"],
      categories: ["رواية", "شعر"],
      copies: 3,
    },
    {
      title: "عائد إلى حيفا",
      isbn: "9789953890010",
      description:
        "رواية عن النكبة الفلسطينية وتجربة اللجوء من خلال عودة سعيد إلى بيته في حيفا.",
      publisher: "دار العودة",
      publishedYear: 1969,
      authors: ["غسان كنفاني"],
      categories: ["رواية", "فكر سياسي"],
      copies: 3,
    },
    {
      title: "مدن الملح",
      isbn: "9789953881005",
      description:
        "ملحمة روائية ضخمة عن اكتشاف النفط وتحولات المجتمع في الجزيرة العربية.",
      publisher: "دار الطليعة",
      publishedYear: 1984,
      authors: ["عبد الرحمن منيف"],
      categories: ["رواية", "تاريخ"],
      copies: 4,
    },
    {
      title: "ذاكرة الجسد",
      isbn: "9789953894407",
      description:
        "رواية عن الحب والثورة الجزائرية، تفوز بجائزة نجيب محفوظ للآداب.",
      publisher: "دار الآداب",
      publishedYear: 1993,
      authors: ["أحلام مستغانمي"],
      categories: ["رواية"],
      copies: 3,
    },
    {
      title: "لا تكن لطيفاً أكثر من اللازم",
      isbn: "9789770920017",
      description:
        "رواية اجتماعية تناقش قضايا المجتمع المصري بأسلوب مشوق.",
      publisher: "دار أخبار اليوم",
      publishedYear: 1958,
      authors: ["إحسان عبد القدوس"],
      categories: ["رواية", "فكر سياسي"],
      copies: 2,
    },
    {
      title: "قصيدة بيروت",
      isbn: "9789953882956",
      description:
        "ديوان شعري عن مدينة بيروت وجمالها وألم الحرب.",
      publisher: "دار اليقظة",
      publishedYear: 1967,
      authors: ["نزار قباني"],
      categories: ["شعر"],
      copies: 3,
    },
    {
      title: "وعاظ السلاطين",
      isbn: "9789953941209",
      description:
        "دراسة في طبيعة الحكم والاستبداد في التاريخ الإسلامي.",
      publisher: "دار الجمل",
      publishedYear: 1965,
      authors: ["علي الوردي"],
      categories: ["تاريخ", "فكر سياسي"],
      copies: 2,
    },
    {
      title: "موسم الهجرة إلى الشمال",
      isbn: "9789953886670",
      description:
        "رواية عن صراع الحضارات والهوية، تعد من أفضل مئة رواية عربية.",
      publisher: "دار العودة",
      publishedYear: 1966,
      authors: ["الطيب صالح"],
      categories: ["أدب كلاسيكي", "رواية"],
      copies: 4,
    },
    {
      title: "أحبك أكثر",
      isbn: "9789953898894",
      description:
        "ديوان شعري يعبر عن أعمق مشاعر الحب والحنين.",
      publisher: "دار رياض الريس",
      publishedYear: 2010,
      authors: ["نزار قباني"],
      categories: ["شعر"],
      copies: 3,
    },
    {
      title: "الشرق الأدنى",
      isbn: "9789953889726",
      description:
        "دراسة في تاريخ الشرق الأدنى القديم وعلاقته بالحضارة العربية.",
      publisher: "دار الوراق",
      publishedYear: 2015,
      authors: ["علي الوردي"],
      categories: ["تاريخ"],
      copies: 2,
    },
    {
      title: "الشراع والعاصفة",
      isbn: "9789953892311",
      description:
        "رواية بحرية عن حياة الصيادين ونضالهم في الساحل السوري.",
      publisher: "دار الاتحاد",
      publishedYear: 1970,
      authors: ["حنا مينه"],
      categories: ["رواية", "رحلات"],
      copies: 3,
    },
    {
      title: "صهيل المسافات",
      isbn: "9789953886602",
      description:
        "مجموعة قصص قصيرة تمزج بين الواقع والخيال بأسلوب ساخر.",
      publisher: "دار المدى",
      publishedYear: 1985,
      authors: ["زكريا تامر"],
      categories: ["قصة قصيرة"],
      copies: 2,
    },
    {
      title: "تلك الرائحة",
      isbn: "9789770801239",
      description:
        "رواية تجريبية عن السجن والقمع في مصر، من رواد الرواية الحديثة.",
      publisher: "دار المستقبل",
      publishedYear: 1966,
      authors: ["صنع الله إبراهيم"],
      categories: ["رواية", "فكر سياسي"],
      copies: 3,
    },
    {
      title: "الإسطبل",
      isbn: "9789953896500",
      description:
        "رواية عن حياة المهاجرين الجزائريين في فرنسا.",
      publisher: "دار الفارابي",
      publishedYear: 2005,
      authors: ["واسيني الأعرج"],
      categories: ["رواية"],
      copies: 3,
    },
    {
      title: "أولاد حارتنا",
      isbn: "9789770907384",
      description:
        "رواية رمزية عن تاريخ البشرية من خلال حارة مصرية، حازت جائزة نوبل.",
      publisher: "دار الشروق",
      publishedYear: 1959,
      authors: ["نجيب محفوظ"],
      categories: ["أدب كلاسيكي", "رواية", "فلسفة"],
      copies: 4,
    },
    {
      title: "النبي",
      isbn: "9789953885377",
      description:
        "كتاب فلسفي شعري يتناول قضايا الحياة والحب والدين بأسلوب رمزي.",
      publisher: "دار النهار",
      publishedYear: 1923,
      authors: ["جبران خليل جبران"],
      categories: ["شعر", "فلسفة"],
      copies: 5,
    },
    {
      title: "أرض البرتقال الحزين",
      isbn: "9789953890027",
      description:
        "مجموعة قصصية عن معاناة الشعب الفلسطيني تحت الاحتلال.",
      publisher: "دار العودة",
      publishedYear: 1963,
      authors: ["غسان كنفاني"],
      categories: ["قصة قصيرة", "فكر سياسي"],
      copies: 2,
    },
    {
      title: "جدارية",
      isbn: "9789953888156",
      description:
        "قصيدة طويلة تعد من أهم الأعمال الشعرية الحديثة، تتأمل الحياة والموت.",
      publisher: "دار رياض الريس",
      publishedYear: 1999,
      authors: ["محمود درويش"],
      categories: ["شعر", "فلسفة"],
      copies: 3,
    },
  ]

  // إنشاء الكتب مع العلاقات
  for (const bookData of booksData) {
    const authorIds = bookData.authors
      .map(
        (authorName) => createdAuthors.find((a) => a.name === authorName)?.id
      )
      .filter((id) => id !== undefined)

    const categoryIds = bookData.categories
      .map(
        (categoryName) =>
          createdCategories.find((c) => c.name === categoryName)?.id
      )
      .filter((id) => id !== undefined)

    const book = await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {
        title: bookData.title,
        description: bookData.description,
        publisher: bookData.publisher,
        publishedYear: bookData.publishedYear,
        authors: {
          set: [],
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

    const existingCopies = await prisma.bookCopy.findMany({
      where: { bookId: book.id },
    })

    const existingCopyNumbers = existingCopies.map((c) => c.copyNumber)

    for (let copyNum = 1; copyNum <= bookData.copies; copyNum++) {
      if (!existingCopyNumbers.includes(copyNum)) {
        await prisma.bookCopy.create({
          data: {
            bookId: book.id,
            copyNumber: copyNum,
            status: "AVAILABLE",
            location: `المكتبة الرئيسية - القسم ${String.fromCharCode(64 + Math.ceil(copyNum / 10))}`,
          },
        })
        console.log(`  📚 تم إنشاء نسخة #${copyNum} لـ "${book.title}"`)
      } else {
        console.log(`  📚 النسخة #${copyNum} موجودة مسبقاً لـ "${book.title}"`)
      }
    }

    console.log(
      `✅ تم إنشاء الكتاب: ${book.title} (${bookData.copies} نسخ)`
    )
  }

  // ============================================
  // 5. إنشاء استعارات تجريبية
  // ============================================
  const studentUser = createdUsers.find((u) => u.role === "STUDENT")
  const availableCopies = await prisma.bookCopy.findMany({
    where: { status: "AVAILABLE" },
    take: 4,
  })

  if (studentUser && availableCopies.length > 0) {
    const today = new Date()
    const copies = availableCopies

    // استعارتان نشطتان
    for (const copy of copies.slice(0, 2)) {
      const dueDate = new Date()
      dueDate.setDate(today.getDate() + 14)

      const existingRental = await prisma.rental.findFirst({
        where: {
          bookCopyId: copy.id,
          studentId: studentUser.id,
          status: "ACTIVE",
        },
      })

      if (!existingRental) {
        const rentalDate = new Date()
        rentalDate.setDate(today.getDate() - 5)

        await prisma.rental.create({
          data: {
            bookCopyId: copy.id,
            studentId: studentUser.id,
            rentedAt: rentalDate,
            dueDate: dueDate,
            status: "ACTIVE",
            notes: "استعارة تجريبية من البذر",
          },
        })
        console.log(
          `📖 تم إنشاء استعارة نشطة للطالب: ${studentUser.name} - النسخة ${copy.copyNumber}`
        )

        await prisma.bookCopy.update({
          where: { id: copy.id },
          data: { status: "RENTED" },
        })
      }
    }

    // استعادة واحدة (معادة)
    const returnedCopy = copies[2]
    if (returnedCopy) {
      const existingReturned = await prisma.rental.findFirst({
        where: {
          bookCopyId: returnedCopy.id,
          studentId: studentUser.id,
          status: "RETURNED",
        },
      })

      if (!existingReturned) {
        const rentedAt = new Date()
        rentedAt.setDate(today.getDate() - 20)
        const dueDate = new Date()
        dueDate.setDate(today.getDate() - 6)
        const returnedAt = new Date()
        returnedAt.setDate(today.getDate() - 7)

        await prisma.rental.create({
          data: {
            bookCopyId: returnedCopy.id,
            studentId: studentUser.id,
            rentedAt,
            dueDate,
            returnedAt,
            status: "RETURNED",
            notes: "تمت الإعادة في الوقت المحدد",
          },
        })
        console.log(
          `📖 تم إنشاء استعارة معادة للطالب: ${studentUser.name}`
        )
      }
    }

    // استعارة متأخرة
    const overdueCopy = copies[3]
    if (overdueCopy) {
      const existingOverdue = await prisma.rental.findFirst({
        where: {
          bookCopyId: overdueCopy.id,
          studentId: studentUser.id,
          status: "ACTIVE",
        },
      })

      if (!existingOverdue) {
        const rentedAt = new Date()
        rentedAt.setDate(today.getDate() - 40)
        const dueDate = new Date()
        dueDate.setDate(today.getDate() - 10)

        await prisma.rental.create({
          data: {
            bookCopyId: overdueCopy.id,
            studentId: studentUser.id,
            rentedAt,
            dueDate,
            status: "ACTIVE",
            notes: "استعارة متأخرة تجريبية",
          },
        })
        console.log(
          `📖 تم إنشاء استعارة متأخرة للطالب: ${studentUser.name}`
        )

        await prisma.bookCopy.update({
          where: { id: overdueCopy.id },
          data: { status: "RENTED" },
        })
      }
    }
  }

  // ============================================
  // الملخص
  // ============================================
  const finalUserCount = await prisma.user.count()
  const finalAuthorCount = await prisma.author.count()
  const finalCategoryCount = await prisma.category.count()
  const finalBookCount = await prisma.book.count()
  const finalCopyCount = await prisma.bookCopy.count()
  const finalRentalCount = await prisma.rental.count()

  console.log("\n🎉 تم البذر بنجاح!")
  console.log("=".repeat(50))
  console.log(`📊 الملخص:`)
  console.log(`  👥 المستخدمون: ${finalUserCount}`)
  console.log(`  ✍️  المؤلفون: ${finalAuthorCount}`)
  console.log(`  📚 التصنيفات: ${finalCategoryCount}`)
  console.log(`  📖 الكتب: ${finalBookCount}`)
  console.log(`  📕 نسخ الكتب: ${finalCopyCount}`)
  console.log(`  🔄 الاستعارات: ${finalRentalCount}`)
  console.log("=".repeat(50))
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء البذر:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
