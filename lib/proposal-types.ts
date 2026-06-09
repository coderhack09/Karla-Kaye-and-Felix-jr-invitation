export type ProposalStatus = "Confirmed" | "Declined"

export type ProposalRoleType = "entourage" | "sponsor-ninong" | "sponsor-ninang"

export type HonorAttendantTitle = "Matron of Honor" | "Maid of Honor"

export type ProposalRoleVariant = "honorAttendant"

export type ProposalRoleCategory = "Entourage" | "Principal Sponsor"

/** Edit roles in content/proposal-roles.ts */
export interface ProposalRoleDefinition {
  id: string
  category: ProposalRoleCategory
  type: ProposalRoleType
  title?: string
  roleCategory?: string
  description?: string
  roleCategoryAliases?: string[]
  variant?: ProposalRoleVariant
  descriptions?: Partial<Record<HonorAttendantTitle, string>>
}

export interface ProposalConfig {
  honorAttendant: HonorAttendantTitle
  roles: ProposalRoleDefinition[]
  roleIdAliases: Record<string, string>
}

export interface ProposalRole {
  id: string
  title: string
  category: ProposalRoleCategory
  type: ProposalRoleType
  roleCategory: string
  description: string
  /** Extra sheet categories that count toward this role (e.g. Matron vs Maid of Honor). */
  roleCategoryAliases?: string[]
}

export interface ProposalResponse {
  id: string
  role: string
  name: string
  status: ProposalStatus
  submittedAt: string
  category: string
}

export interface ProposalSubmitPayload {
  role: string
  name: string
  status: ProposalStatus
  submittedAt: string
}
