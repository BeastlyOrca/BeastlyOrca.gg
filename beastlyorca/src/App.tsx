import { useState } from 'react'
import reactLogo from './images/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProjectCard from './typeScript/projectCard';
import './styles/normalize.css';
import './styles/style.css';



function App() {
  const [count, setCount] = useState(0)

  return (

    <>

      <div>

        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>

      </div>

      <h1>Vite + React</h1>

      <div className="card">

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>

      </div>


      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div className="portfolio">

        <h1>Welcome to BeastlyOrca</h1>
        <p>This is where I showcase my work, projects, and brand.</p>
        {/* Add more components like <ProjectCard /> here */}

      </div>

      <div className="projects-row">
        <ProjectCard
          image="/assets/project1.jpg"
          title="Hookshot Henry"
          description="My first attempt at a playable game"
        />
        {/* Add more ProjectCard components as needed */}
      </div>


    </>

  )

}

export default App
