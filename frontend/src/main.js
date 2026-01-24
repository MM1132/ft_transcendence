import { mount } from 'svelte'
// import './app.css'
import './style.css' //my style file
import App from './App.svelte'

const app = mount(App, {target: document.getElementById('app'),})

export default app  