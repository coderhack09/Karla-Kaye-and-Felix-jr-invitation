import { siteConfig } from "@/content/site"
import type {
  HonorAttendantTitle,
  ProposalRole,
  ProposalRoleDefinition,
} from "@/lib/proposal-types"

export const HONOR_ATTENDANT_CATEGORIES: HonorAttendantTitle[] = [
  "Matron of Honor",
  "Maid of Honor",
]

const DEFAULT_HONOR_ATTENDANT_DESCRIPTIONS: Record<HonorAttendantTitle, string> = {
  "Matron of Honor":
    "To stand beside the bride with love and grace — lending a steady hand through every step of the day, sharing in her joy and excitement, and helping make each moment leading up to and on our wedding day truly unforgettable.",
  "Maid of Honor":
    "To stand beside the bride with love and loyalty — lending a steady hand through every step of the day, sharing in her joy and excitement, and helping make each moment leading up to and on our wedding day truly unforgettable.",
}

function getProposalConfig() {
  return siteConfig.proposal
}

export function getHonorAttendantTitle(): HonorAttendantTitle {
  return getProposalConfig()?.honorAttendant ?? "Matron of Honor"
}

export const PROPOSAL_ROLE_ID_ALIASES: Record<string, string> =
  getProposalConfig()?.roleIdAliases ?? {}

function resolveHonorAttendantRole(definition: ProposalRoleDefinition): ProposalRole {
  const title = getHonorAttendantTitle()
  const descriptions = {
    ...DEFAULT_HONOR_ATTENDANT_DESCRIPTIONS,
    ...definition.descriptions,
  }

  return {
    id: definition.id,
    title,
    category: definition.category,
    type: definition.type,
    roleCategory: title,
    roleCategoryAliases: HONOR_ATTENDANT_CATEGORIES.filter((category) => category !== title),
    description: descriptions[title],
  }
}

function resolveRoleDefinition(definition: ProposalRoleDefinition): ProposalRole {
  if (definition.variant === "honorAttendant") {
    return resolveHonorAttendantRole(definition)
  }

  if (!definition.title || !definition.roleCategory || !definition.description) {
    throw new Error(
      `Proposal role "${definition.id}" is missing title, roleCategory, or description.`
    )
  }

  return {
    id: definition.id,
    title: definition.title,
    category: definition.category,
    type: definition.type,
    roleCategory: definition.roleCategory,
    roleCategoryAliases: definition.roleCategoryAliases,
    description: definition.description,
  }
}

function buildProposalRoles(): ProposalRole[] {
  const definitions = getProposalConfig()?.roles ?? []
  return definitions.map(resolveRoleDefinition)
}

export const PROPOSAL_ROLES: ProposalRole[] = buildProposalRoles()

function getRoleSheetCategories(role: ProposalRole): string[] {
  return [role.roleCategory, ...(role.roleCategoryAliases ?? [])].map((category) =>
    category.trim().toLowerCase()
  )
}

export function getProposalRoleById(roleId: string): ProposalRole | undefined {
  const resolvedId = PROPOSAL_ROLE_ID_ALIASES[roleId] ?? roleId
  return PROPOSAL_ROLES.find((role) => role.id === resolvedId)
}

export function getRoleSingular(title: string): string {
  return title.endsWith("s") ? title.slice(0, -1) : title
}

function getProposalRoleCategories(category: ProposalRole["category"]): Set<string> {
  const categories = new Set<string>()

  for (const role of PROPOSAL_ROLES) {
    if (role.category !== category) continue
    for (const sheetCategory of getRoleSheetCategories(role)) {
      categories.add(sheetCategory)
    }
  }

  return categories
}

export function countFilledNamesByProposalRoles(
  entourageRows: Array<{ Name?: string; RoleCategory?: string }>,
  sponsorRows: Array<{ MalePrincipalSponsor?: string; FemalePrincipalSponsor?: string }>
) {
  const entourageCategories = getProposalRoleCategories("Entourage")

  const filledEntourage = entourageRows.filter((row) => {
    const name = (row.Name ?? "").trim()
    const category = (row.RoleCategory ?? "").trim().toLowerCase()
    return name && entourageCategories.has(category)
  }).length

  const filledSponsors = sponsorRows.reduce((total, row) => {
    let count = 0
    if ((row.MalePrincipalSponsor ?? "").trim()) count += 1
    if ((row.FemalePrincipalSponsor ?? "").trim()) count += 1
    return total + count
  }, 0)

  return { filledEntourage, filledSponsors }
}

export const PROPOSAL_ENTOURAGE_ROLE_SLOTS = PROPOSAL_ROLES.filter(
  (role) => role.category === "Entourage"
).length

export const PROPOSAL_SPONSOR_ROLE_SLOTS = PROPOSAL_ROLES.filter(
  (role) => role.category === "Principal Sponsor"
).length
