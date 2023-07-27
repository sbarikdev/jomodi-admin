import React from 'react'
import { Image } from '@mantine/core'

function AppHeader() {
  return (
    <div style={{
      backgroundColor: 'black',
    }}>
      <Image src='./logo.png' width={100} radius="xl" />
    </div>
  )
}

export default AppHeader