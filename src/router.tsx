import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import FollowBox from './components/FollowBox/FollowBox'
import FollowBoxDynamic from './components/FollowBoxDynamic/FollowBoxDynamic'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'follow',
        element: <FollowBox />,
      },
      {
        path: 'follow-dynamic',
        element: <FollowBoxDynamic />,
      },
    ],
  },
])
