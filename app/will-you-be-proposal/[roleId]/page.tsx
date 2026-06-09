import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ProposalPage } from "@/components/proposal-page"
import { getProposalRoleById } from "@/lib/proposal-roles"
import { buildProposalMetadata } from "@/lib/proposal-metadata"

interface PageProps {
  params: Promise<{ roleId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { roleId } = await params
  const role = getProposalRoleById(roleId)

  if (!role) {
    return {}
  }

  return buildProposalMetadata({
    roleTitle: role.title,
    path: `/will-you-be-proposal/${roleId}`,
  })
}

export default async function WillYouBeProposalPage({ params }: PageProps) {
  const { roleId } = await params
  const role = getProposalRoleById(roleId)

  if (!role) {
    notFound()
  }

  return <ProposalPage role={role} />
}
