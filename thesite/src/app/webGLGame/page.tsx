"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WebGLGamePage() {
  useEffect(() => {
    // Load external scripts
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const loadScripts = async () => {
      try {
        await loadScript("/lib/gl-matrix.js")
        await loadScript("/scripts/commonFunctions.js")
        await loadScript("/scripts/WebGLGame.js")
      } catch (error) {
        console.error("Failed to load game scripts:", error)
        const errorDiv = document.getElementById("webglError")
        if (errorDiv) {
          errorDiv.innerHTML = '<p style="color: red;">Failed to load game scripts. Please refresh the page.</p>'
        }
      }
    }

    loadScripts()

    // Cleanup function
    return () => {
      // Remove event listeners if needed
      const scripts = document.querySelectorAll('script[src^="/lib/"], script[src^="/scripts/"]')
      scripts.forEach((script) => script.remove())
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-white italic">
              BeastlyOrca
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white bg-transparent">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Error display */}
      <div id="webglError" className="pt-20"></div>

      {/* Main content */}
      <main className="pt-20">
        <section className="py-8 px-4 text-center">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">CMPT370 Final Project</h2>
          <div className="flex justify-center gap-8 mb-4">
            <p id="integerDisplay" className="text-lg font-semibold">
              Score: 0
            </p>
            <p id="integerDisplay2" className="text-lg font-semibold">
              High Score: 0
            </p>
          </div>
        </section>

        <section className="px-4 text-center">
          <div className="inline-block border-2 border-emerald-400 rounded-lg p-2">
            <canvas
              id="exampleCanvas"
              width="640"
              height="480"
              className="block"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </section>

        <section className="py-8 px-4 text-center max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Instructions</h3>
            <div className="space-y-2 text-slate-300">
              <p>
                <strong>Movement:</strong> Use <kbd className="bg-slate-700 px-2 py-1 rounded">W</kbd>
                <kbd className="bg-slate-700 px-2 py-1 rounded mx-1">A</kbd>
                <kbd className="bg-slate-700 px-2 py-1 rounded">S</kbd>
                <kbd className="bg-slate-700 px-2 py-1 rounded mx-1">D</kbd> keys
              </p>
              <p>
                <strong>First Person:</strong> Press <kbd className="bg-slate-700 px-2 py-1 rounded">P</kbd>
              </p>
              <p>
                <strong>Change Perspective:</strong> Press <kbd className="bg-slate-700 px-2 py-1 rounded">Q</kbd>
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">Objective</h3>
            <p className="text-slate-300 mb-4">
              Dodge the cubes as the player (green) and see how high you can get your score.
            </p>
            <p className="text-slate-400 italic">Made by: Luc Gaucher and Nadir Bakridi</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-slate-700">
        <p className="text-slate-400">© 2025 BeastlyOrca. All rights reserved.</p>
      </footer>
    </div>
  )
}
