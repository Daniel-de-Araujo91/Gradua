# React (Base)

## JSX

Mistura de HTML + JS:

```jsx
const App = () => {
  return <h1>Hello World</h1>
}
```

---

## Componentes

```jsx
function Button({ text }) {
  return <button>{text}</button>
}
```

Uso:

```jsx
<Button text="Clique" />
```

---

## Estado (useState)

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

---

## Efeitos (useEffect)

```jsx
import { useEffect } from 'react'

useEffect(() => {
  console.log('montou')
}, [])
```

---

# Tailwind CSS

## Uso básico

```jsx
<button className="bg-blue-500 text-white p-2 rounded">
  Botão
</button>
```

---

# Mobile First (ESSENCIAL)

Tailwind usa mobile-first por padrão.

```html
<div className="text-sm md:text-lg lg:text-xl">
```

Breakpoints:

* sm
* md
* lg
* xl

---

# Layout Responsivo

## Flexbox

```jsx
<div className="flex justify-between items-center">
```

## Grid

```jsx
<div className="grid grid-cols-2 gap-4">
```

---

# Renderização Condicional

```jsx
{isLogged ? <Dashboard /> : <Login />}
```

---

# Listas

```jsx
items.map(item => (
  <div key={item.id}>{item.name}</div>
))
```

---

# Consumo de API

```jsx
import { useEffect, useState } from 'react'

function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return users.map(u => <p key={u.id}>{u.name}</p>)
}
```

---

# Roteamento

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

📚 Docs: [https://reactrouter.com](https://reactrouter.com)

---

# Gerenciamento de Estado

## Context API

```jsx
import { createContext, useContext } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)
```

---
