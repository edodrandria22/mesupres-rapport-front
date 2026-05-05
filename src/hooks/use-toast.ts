"use client"

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const toast = React.useCallback(({ ...props }: Omit<ToasterToast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((toasts) => [{ ...props, id }, ...toasts].slice(0, TOAST_LIMIT))
    return id
  }, [])

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => setToasts([]),
  }
}