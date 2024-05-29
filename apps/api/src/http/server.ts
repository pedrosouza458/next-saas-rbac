import fastifyCors from '@fastify/cors'
import fasitfyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { getOrganizationBilling } from './routes/billing/get-organization-billing'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invite'
import { deleteInvite } from './routes/invites/delete-invite'
import { getInvite } from './routes/invites/get-invite'
import { getInvites } from './routes/invites/get-invites'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { rejectInvite } from './routes/invites/reject-invite'
import { deleteMember } from './routes/members/delete-member'
import { getMembers } from './routes/members/get-members'
import { updateMember } from './routes/members/update-members'
import { createOrganization } from './routes/orgs/create-organization'
import { deleteOrganization } from './routes/orgs/delete-organization'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { transferOrganization } from './routes/orgs/transfer-organization'
import { udpateOrganization } from './routes/orgs/update-organization'
import { createProject } from './routes/projects/create-project'
import { deleteProject } from './routes/projects/delete-project'
import { getProject } from './routes/projects/get-project'
import { getProjects } from './routes/projects/get-projects'
import { updateProject } from './routes/projects/update-project'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js Saas',
      description: 'Full-stack SaaS app with multi-tenant and RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifyCors)

/**
 * Errors
 */
app.setErrorHandler(errorHandler)

/**
 * Auth
 */
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGithub)

/**
 * Organizations
 */
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(udpateOrganization)
app.register(deleteOrganization)
app.register(transferOrganization)

/**
 * Projects
 */
app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)
app.register(getPendingInvites)

/**
 * Members
 */
app.register(getMembers)
app.register(updateMember)
app.register(deleteMember)

/**
 * Invites
 */
app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(deleteInvite)

/**
 * Billing
 */
app.register(getOrganizationBilling)

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fasitfyJwt, {
  secret: env.JWT_SECRET,
})

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running')
})
