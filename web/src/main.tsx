import { createRoot } from 'react-dom/client'
import './styles.css'
// Side-effect import: registers every three/webgpu class with R3F's reconciler.
import './r3f-webgpu'
import { App } from './App'

// Note: intentionally no StrictMode — its double-invoked effects fight the
// WebGPU renderer's single async init.
const container = document.getElementById('root')
if (!container) throw new Error('#root not found')
createRoot(container).render(<App />)
