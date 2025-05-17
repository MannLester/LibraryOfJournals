import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Add style element to head for critical overrides
const style = document.createElement('style')
style.textContent = `
  body, html, #app {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }
  
  header {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
`
document.head.appendChild(style)

createApp(App).mount('#app')
