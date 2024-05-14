import { defineAbilityFor } from '@saas/auth'
import { projectSchema } from '@saas/auth/src/models/project'

const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-id' })

const project = projectSchema.parse({ id: 'projectId', ownerId: 'user-id' })

console.log(ability.can('delete', project))
