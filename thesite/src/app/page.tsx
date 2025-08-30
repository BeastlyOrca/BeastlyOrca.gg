"use client"

import { useState, useEffect } from "react"
import { Github, Linkedin, Mail, ExternalLink, Code, Database, Globe, Gamepad2, Download, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

import {
  Palette,
  Presentation,
  Cpu,
  Lightbulb,
} from "lucide-react";



export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Section highlight logic
      const sections = ["home", "about", "portfolio", "skills", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }

      // Show/hide Back to Top button
      setShowTopBtn(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (

    <div className="min-h-screen bg-slate-900 text-white">

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center py-4">

            <div className="text-2xl font-bold text-white italic">BeastlyOrca</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "portfolio", label: "Portfolio" },
                { id: "skills", label: "Skills" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors ${
                    activeSection === item.id ? "text-emerald-400" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>


            {/* ############## NAV BUTTONS ##################### */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="/downloadables/StyledResumeRedo.pdf" download="NadirBakridi_Resume.pdf">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              </a>

              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 hidden md:inline-flex">
                <Link href="/webGLGame">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  WebGLGame
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col space-y-4">
                {[
                  { id: "home", label: "Home" },
                  { id: "about", label: "About" },
                  { id: "portfolio", label: "Portfolio" },
                  { id: "skills", label: "Skills" },
                  { id: "contact", label: "Contact" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex flex-col space-y-2 pt-4">

                  <a href="/downloadables/StyledResumeRedo.pdf" download="NadirBakridi_Resume.pdf" className="block">

                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-emerald-500 text-emerald-400 bg-transparent w-full"
                    >
                      <span>
                        <Download className="mr-2 h-4 w-4" />
                        Resume
                      </span>
                    </Button>
                    
                  </a>

                  <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 w-full">
                    <span>
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      WebGLGame
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ############ IM NADIR SECTION ############ */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Hi, I am <span className="text-emerald-400">Nadir Bakridi</span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Developer, Creator, and Digital Innovator building the future one project at a time
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <a href="mailto:beastlyorca@gmail.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Get In Touch
                </a>
                
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white bg-transparent"
                onClick={() => scrollToSection("portfolio")}
              >
                <Code className="mr-2 h-4 w-4" />
                View My Work
              </Button>

            </div>
          </div>
        </div>

      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-4">What Is BeastlyOrca?</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Created by Nadir Bakridi as a personal showcase and growing creative brand. This site is both a
                reflection of who I am as a developer and a space to highlight the projects, skills, and media that I
                have been working on.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Beyond a portfolio, the future plan for BeastlyOrca is to be a platform to establish a unique identity —
                a name people can associate with games, useful tools, and creative tech. I also want this space to
                celebrate the work of friends and family, giving them a platform to share their ideas and talents.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                Whether you are here to explore what we have made, collaborate on something new, or just surfing the
                net, BeastlyOrca is here to create things that are fun to play, useful to use, or worth sharing.
              </p>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 gap-6">
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Mission</h3>
                    <p className="text-slate-300">
                      To create innovative digital experiences that bridge the gap between technology and creativity.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Vision</h3>
                    <p className="text-slate-300">
                      Building a platform where creativity meets functionality, fostering collaboration and innovation.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* #####################  Profile Photos Section ##############################*/ }
          <div className="text-center">
          
            <h3 className="text-2xl font-bold text-emerald-400 mb-8">Nadir Bakridi</h3>

            <div className="flex flex-col md:flex-row justify-center items-center gap-64">

              {[
                { src: "/images/grad1.jpeg", alt: "Graduation Photo", label: "Professional", link: "https://www.linkedin.com/in/nadir-bakridi-04132116a/"},
                { src: "/images/imgMe1.jpg", alt: "Professional Photo", label: "Github", link:"https://github.com/BeastlyOrca" },
                { src: "/images/imgMe4.png", alt: "Casual Photo", label: "Creator", link: "https://www.youtube.com/@beastlyorca192" },
              ].map((photo, index) => (
                <div key={index} className="text-center">

                  <div className="relative w-60 h-60 mx-auto">

                    <a
                      href={photo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      >
                    

                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover rounded-full border-4 border-emerald-400 shadow-lg hover:scale-105 transition-transform group-hover:border-[#150046] transition-all duration-300 shadow-lg"
                      sizes="240px"
                    />

                    </a>
                  </div>

                  <p className="text-emerald-400 font-medium mt-3">{photo.label}</p>

                </div>
              ))}

            </div>


          </div>
        </div>

      </section>

      {/* ############################# Portfolio Section ########################### 
      */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-4">Featured Projects</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              A collection of projects showcasing my skills in development, design, and creative problem-solving.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Crokinole (WIP)",
                description:
                  "Making the classic tabletop game digital",
                image: "/images/Crokinole.png",
                tags: ["C#", "Unity", "Android", "Physics", "Apple", "MacOS"],
                github: "https://github.com/BeastlyOrca/Crokinole",
                demo: "https://github.com/BeastlyOrca/Crokinole",
                
              },
              {
                title: "Published Conference Paper",
                description:
                  "Developing Virtual Simulation of Optic Lab in Physics Education using Virtual Reality",
                image: "/images/VR.png",
                tags: ["C#", "Unity", "VR", "AI", "Physics", "Education", "Conference"],
                github: "https://github.com/Harisk25/VRFinalProject",
                demo: "https://publications.immersivelrn.org/index.php/practitioner/article/view/411",
                featured: true,
              },
              {
                title: "Hookshot Henry",
                description: "My first attempt at a game, a 3D platformer with a grappling hook mechanic. Password is: swingintoaction",
                image: "/images/HH.png",
                tags: ["Unity", "2D", "Physics", "Procedural Generation", "C#", "Game Development"],
                github: "https://github.com/jemery-dev/CMPT330-Project",
                demo: "https://jemery-dev.itch.io/hookshot-henry",
              },
            ].map((project, index) => (
              <Card
                key={index}
                className={`group pt-0 hover:shadow-xl transition-all bg-slate-800 border-slate-600 ${project.featured ? "ring-2 ring-emerald-400" : ""}`}
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {project.featured && <Badge className="absolute top-2 right-2 bg-emerald-600">Featured</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-2 text-white">{project.title}</CardTitle>
                  <CardDescription className="mb-4 text-slate-300">{project.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="bg-slate-700 text-emerald-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">

                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>

                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >

                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {project.title === "Published Conference Paper" ? "Paper" : "Demo"}
                      </a>

                    </Button>

                  </div>
                  
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/*######### Skills Section ############*/}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-4">Skills & Technologies</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              A multi-disciplinary blend of software engineering, game design, and user-centered thinking.
            </p>

          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Code className="h-8 w-8 text-emerald-400" />,
                title: "Frontend Development",
                skills: [
                  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", 
                  "HTML/CSS", "Framer Motion", "ShadCN/UI", "Lucide Icons"
                ],
              },
              {
                icon: <Database className="h-8 w-8 text-emerald-400" />,
                title: "Backend & APIs",
                skills: [
                  "Node.js", "Express", "Python", "PostgreSQL", "MongoDB", 
                  "REST APIs", "GraphQL"
                ],
              },
              {
                icon: <Globe className="h-8 w-8 text-emerald-400" />,
                title: "DevOps & Tools",
                skills: [
                  "Docker", "GitHub Actions", "CI/CD", "Vercel", "AWS", 
                  "Bash", "Unix", "Version Control", "Firebase", "Netlify"
                ],
              },
              {
                icon: <Gamepad2 className="h-8 w-8 text-emerald-400" />,
                title: "Game & XR Development",
                skills: [
                  "Unity", "C#", "VR (Meta Quest)", "WebGL", 
                  "GLSL", "Three.js", "Physics", "AI Sensors", "Procedural Generation", 
                  "Pathfinding"
                ],
              },
              {
                icon: <Palette className="h-8 w-8 text-emerald-400" />,
                title: "Design & UX",
                skills: [
                  "Figma", "UX Auditing", "Wireframing", "Accessibility", 
                  "Responsive Design", "User Research", "Digital Experience Design"
                ],
              },
              {
                icon: <Presentation className="h-8 w-8 text-emerald-400" />,
                title: "Teaching & Communication",
                skills: [
                  "Mentorship", "Curriculum Design", "Workshop Facilitation", 
                  "Code Ninjas Instructor", "Agile Collaboration", "Documentation"
                ],
              },
              {
                icon: <Cpu className="h-8 w-8 text-emerald-400" />,
                title: "CS Fundamentals",
                skills: [
                  "Data Structures", "Algorithms", "OOP", "Software Architecture", 
                  "Multithreading", "Schedulers", "Regex", "Shell Tools"
                ],
              },
              {
                icon: <Lightbulb className="h-8 w-8 text-emerald-400" />,
                title: "Research & Projects",
                skills: [
                  "AI Sensors vs Conventional", "Genetic Programming", 
                  "Behavior Trees", "ML Concepts", "Academic Writing", 
                  "Prototyping", "VR Curriculum Design"
                ],
              },
            ].map((category, index) => (
              <Card
                key={index}
                className="text-center bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">{category.icon}</div>
                  <CardTitle className="text-white">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="outline"
                        className="mr-2 mb-2 border-emerald-400 text-emerald-400"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/*############### Contact Section ###################*/}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-4">Lets Create Something Amazing</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Hows it going? Thanks for checking out my website! Here, you can find a glimpse into the projects and ideas
            Im passionate about. Ready to collaborate or just want to chat about tech?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <a href="mailto:beastlyorca@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white bg-transparent"
            >
              <a
                href="https://www.linkedin.com/in/nadir-bakridi-04132116a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                Connect on LinkedIn
              </a>
            </Button>
          </div>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/BeastlyOrca" className="text-slate-400 hover:text-emerald-400 transition-colors">
              <Github className="h-8 w-8" />
            </a>
            <a href="https://www.linkedin.com/in/nadir-bakridi-04132116a/" className="text-slate-400 hover:text-emerald-400 transition-colors">
              <Linkedin className="h-8 w-8" />
            </a>
            <a href="mailto:beastlyorca@gmail.com" className="text-slate-400 hover:text-emerald-400 transition-colors">
              <Mail className="h-8 w-8" />
            </a>
          </div>
        </div>
      </section>

      {/*################# Back to Top Button #################*/}

      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 bg-[#3b1966] hover:bg-[#5b2a91] text-white p-3 rounded-full shadow-lg transition-all transform hover:-translate-y-1"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>

        </button>
      )}

      
      {/*##############  Footer ################*/}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">
            © 2025 BeastlyOrca - Nadir Bakridi. Building the future, one project at a time.
          </p>

          <p className="text-slate-400">
            Available for work!
          </p>

        </div>
      </footer>
    </div>
  )
}