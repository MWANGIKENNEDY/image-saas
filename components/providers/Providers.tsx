import React from 'react'

import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { clerkModalAppearance } from '@/lib/clerk-modal-appearance'

const Providers = ({children}:{children:React.ReactNode}) => {
  return (
     <ClerkProvider appearance={clerkModalAppearance}>
        {children}
     </ClerkProvider>
  )
}

export default Providers