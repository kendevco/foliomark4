import AboutServer from './_components/_about/AboutServer'
import Contact from './_components/contact'
import Intro from './_components/intro'

import Projects from './_components/projects'
import SectionDivider from './_components/section-divider'
import Skills from './_components/skills'
import ProjectsServer from './_components/_projects/ProjectsServer'
import SkillsServer from './_components/_skills/SkillsServer'
import ExperiencesServer from './_components/_experiences/ExperiencesServer'
import Footer from './_components/footer'
import AddressVerifier from './_components/addressverifier'

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <Intro />
      <AboutServer />
      <ProjectsServer />
      <SkillsServer />
      <ExperiencesServer />
      <Contact />
      <Footer />
    </main>
  )
}
