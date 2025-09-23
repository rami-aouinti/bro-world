// prisma/seed.ts (ou seed.js en ESM)
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // Companies
  const companies = []
  for (let i = 0; i < 5; i++) {
    const company = await prisma.companies.create({
      data: {
        name: faker.company.name(),
        city: faker.location.city(),
        country: faker.location.country(),
        isEvaluation: faker.datatype.boolean(),
        websiteUrl: faker.internet.url(),
        createdAt: faker.date.past(),
        // updatedAt est @updatedAt -> inutile de l'envoyer
      },
    })
    companies.push(company)
  }

  // Customers
  const customers = []
  for (let i = 0; i < 10; i++) {
    const customer = await prisma.customers.create({
      data: {
        company: { connect: { id: faker.helpers.arrayElement(companies).id } },
        email: faker.internet.email(),
        name: faker.person.fullName(),
        status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
        createdAt: faker.date.past(),
      },
    })
    customers.push(customer)
  }

  // Assigner des employees (ids des customers) aux companies
  for (const company of companies) {
    const employeeCount = faker.number.int({ min: 1, max: 3 })
    const employeeIds = faker.helpers.arrayElements(
      customers.map(c => c.id),
      employeeCount
    )

    await prisma.companies.update({
      where: { id: company.id },
      data: { employeeIds },
    })
  }

  // Notes (relation many-to-many implicite avec Customers via relatedCustomers)
  for (let i = 0; i < 8; i++) {
    const related = faker.helpers.arrayElements(customers, { min: 1, max: 3 })
    await prisma.notes.create({
      data: {
        body: faker.lorem.sentence(),
        relatedCustomers: {
          connect: related.map(c => ({ id: c.id })),
        },
        contact_method: faker.helpers.arrayElement([
          'email',
          'phone',
          'e-meet',
          'social-media',
          'in-person',
          'other',
        ]),
        createdAt: faker.date.past(),
      },
    })
  }

  // Projects
  const projects = []
  for (let i = 0; i < 15; i++) {
    const project = await prisma.projects.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        company: { connect: { id: faker.helpers.arrayElement(companies).id } },
        createdAt: faker.date.past(),
      },
    })
    projects.push(project)
  }

  // Tasks
  for (let i = 0; i < 30; i++) {
    await prisma.tasks.create({
      data: {
        name: faker.hacker.verb(),
        description: faker.lorem.sentence(),
        project: { connect: { id: faker.helpers.arrayElement(projects).id } },
        createdAt: faker.date.past(),
      },
    })
  }

  // Logs
  for (let i = 0; i < 8; i++) {
    const randomProject = faker.helpers.arrayElement(projects)
    const randomTask = await prisma.tasks.findFirst({
      where: { projectId: randomProject.id },
      select: { id: true },
    })

    if (randomTask) {
      await prisma.logs.create({
        data: {
          elapsedTime: faker.number.int({ min: 300, max: 14_400 }),
          project: { connect: { id: randomProject.id } },
          company: { connect: { id: randomProject.companyId } },
          task: { connect: { id: randomTask.id } },
          createdAt: faker.date.past(),
        },
      })
    } else {
      console.log(`No task found for project ${randomProject.id}. Skipping log creation.`)
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
