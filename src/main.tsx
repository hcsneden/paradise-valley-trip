import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, trailhead } from '@hcsneden/design-library'
import { App } from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={trailhead}>
      <App />
    </ThemeProvider>
  </StrictMode>
)
