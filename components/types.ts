import React from "react"

export enum AppState {
  LOADING = "LOADING",
  LANDING = "LANDING",
  DETAILS = "DETAILS",
}

export interface FadeProps {
  show: boolean
  children: React.ReactNode
  className?: string
  delay?: number
}










