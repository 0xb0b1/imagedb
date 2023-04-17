import React from 'react'
import * as Toast from '@radix-ui/react-toast'
import { X } from 'phosphor-react'

export const ToastSuccess = ({ open, setOpenToast }: any) => {
  return (
    <Toast.Root
      className="bg-surface0 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
      open={open}
      onOpenChange={setOpenToast}
    >
      <Toast.Description asChild>
        <span>Sua imagem foi cadastrada com sucesso.</span>
      </Toast.Description>
      <Toast.Action
        className='[grid-area:_action]'
        asChild
        altText='Goto schedule to undo'
      >
        <button>
          <X size={22} />
        </button>
      </Toast.Action>
    </Toast.Root>
  )
}
