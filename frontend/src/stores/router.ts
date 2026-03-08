import { writable } from 'svelte/store'

export const currentPath = writable<string>(window.location.pathname)

const protectedRoutes = ['/dashboard', '/setting']
let isProtected = protectedRoutes.includes(window.location.pathname)
let protectedPath = isProtected ? window.location.pathname : ''

export function navigateTo(path: string): void
{
    if (protectedRoutes.includes(path))
    {
        isProtected = true
        protectedPath = path
        window.history.replaceState(null, '', path)

        window.history.pushState(null, '', path)
        window.history.back()
        window.history.forward()
    }
    else
    {
        isProtected = false
        protectedPath = ''
    }
    currentPath.set(path)
}

// Block back/forward navigation
window.addEventListener('popstate', () => {
    if (isProtected)
    {
        history.go(1)
        return
    }

    const path = window.location.pathname || '/'

    // Block forward navigation to protected routes when logged out
    if (protectedRoutes.includes(path))
    {
        window.history.replaceState(null, '', '/')
        currentPath.set('/')
        return
    }

    currentPath.set(path)
})












// document.addEventListener('keydown', (e: KeyboardEvent) => {
//     if (isProtected && e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight'))
//     {
//         e.preventDefault()
//     }
// })

// import { writable } from 'svelte/store'

// function normalize(path: string): string
// {
//   if (!path) return '/'
//   return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
// }

// const initial = normalize(window.location.pathname || '/')
// export const currentPath = writable<string>(initial)

// export function navigateTo(path: string): void
// {
//   const next = normalize(path)
//   const current = normalize(window.location.pathname || '/')

//   if (next === current) return

//   window.history.pushState(null, '', next)
//   currentPath.set(next)
// }

// Keep store in sync when user uses browser back/forward
// window.addEventListener('popstate', () => {
//   currentPath.set(normalize(window.location.pathname || '/'))
// })
