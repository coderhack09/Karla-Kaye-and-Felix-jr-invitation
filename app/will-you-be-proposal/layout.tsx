import type { Metadata } from "next"
import { buildProposalMetadata } from "@/lib/proposal-metadata"

export const metadata: Metadata = buildProposalMetadata()

export default function WillYouBeProposalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
