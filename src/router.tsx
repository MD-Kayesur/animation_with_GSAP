import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import FollowBox from './components/FollowBox/FollowBox'
import FollowBoxDynamic from './components/FollowBoxDynamic/FollowBoxDynamic'
import Hero from './components/Hero/Hero'
import PanelsSlider from './components/PanelsSlider/PanelsSlider'
import ScrollBoxes from './components/ScrollBoxes/ScrollBoxes'

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
      {
        path: 'hero',
        element: <Hero />,
      },
      {
        path: 'panels',
        element: <PanelsSlider />,
      },
      {
        path: 'scroll-boxes',
        element: <ScrollBoxes />,
      },
    ],
  },
])
