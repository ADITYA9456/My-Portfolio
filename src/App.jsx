import { MotionConfig } from 'framer-motion'
import About from './Components/About'
import Footer from './Components/Footer'
import Navbar from './Components/Navbar'
import Project from './Components/Project'
import Skills from './Components/Skills'
import Section from './Components/Section'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <Section />
      <div className="mt-10 mb-10 mx-6 lg:mx-20"><hr className="h-px border-0 bg-rule" /></div>
      <About/>
      <div className="mt-10 mb-10 mx-6 lg:mx-20"><hr className="h-px border-0 bg-rule" /></div>
      <Project/>
      <div className="mt-10 mb-10 mx-6 lg:mx-20"><hr className="h-px border-0 bg-rule" /></div>
      <Skills />
      <Footer />
    </MotionConfig>
  )
}

export default App