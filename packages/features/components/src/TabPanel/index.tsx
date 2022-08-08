import { Box, Typography } from '@mui/material'
import React from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  padding?: number
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: props.padding ?? 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
