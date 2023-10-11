import React from 'react'
import ReactDOM from 'react-dom/client'
// import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
// import App from './App.tsx'
import './index.css'
// import StartPage from "./StartPage.tsx";
import ITunesPage from "./ITunesPage.tsx";
// import InputField from "./components/InputField.tsx";


// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <h1>Это наша стартовая страница</h1>
//     },
//     {
//         path: '/new',
//         element: <h1>Это наша страница с чем-то новеньким</h1>
//     }
// ])
//
// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//         <ul>
//             <li>
//                 <a href="/">Старт</a>
//             </li>
//             <li>
//                 <a href="/new">Хочу на страницу с чем-то новеньким</a>
//             </li>
//         </ul>
//         <hr />
//         <RouterProvider router={router} />
//     </React.StrictMode>,
// )

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*<App />*/}
    {/*<StartPage />*/}
    <ITunesPage />
    {/*<InputField />*/}
  </React.StrictMode>,
)
