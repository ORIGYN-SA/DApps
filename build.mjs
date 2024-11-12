// build.mjs

import { execSync } from 'child_process' // Import execSync to execute shell commands
import fs from 'fs' // Import fs module to interact with the file system
import path from 'path' // Import path module to handle and transform file paths

try {
  // Log the start of the dist directory cleanup
  console.log('Removing the dist directory...')

  // Remove the 'dist' directory recursively and forcefully
  fs.rmSync(path.resolve('.', 'dist'), { recursive: true, force: true })

  // Log the start of the TypeScript compilation
  console.log('Compiling TypeScript...')

  // Execute the TypeScript compiler in build mode
  execSync('tsc -b', { stdio: 'inherit' })

  // Define the path to the 'bundlePages' directory
  const bundlePagesDir = path.resolve('.', 'src', 'bundlePages')

  // Check if the 'bundlePages' directory exists
  if (!fs.existsSync(bundlePagesDir)) {
    throw new Error(`The bundlePages directory does not exist at: ${bundlePagesDir}`)
  }

  // Read all entries in the 'bundlePages' directory and filter to include only directories
  const directories = fs.readdirSync(bundlePagesDir).filter(file => {
    return fs.statSync(path.join(bundlePagesDir, file)).isDirectory()
  })

  // Iterate over each directory inside 'bundlePages'
  for (const dir of directories) {
    // Define the path to the Vite configuration file within the current bundle page directory
    const viteConfigPath = path.join(bundlePagesDir, dir, 'vite.config.ts')

    // Log the start of the build process for the current bundle page
    console.log(`Building bundle page: ${dir} with config: ${viteConfigPath}`)

    // Check if the Vite configuration file exists
    if (!fs.existsSync(viteConfigPath)) {
      throw new Error(`Vite configuration file does not exist at: ${viteConfigPath}`)
    }

    // Log the execution of the Vite build command with the specified configuration
    console.log(`Executing vite build with config: ${viteConfigPath}`)

    // Execute the Vite build command using the specified configuration file
    execSync(`vite build -c "${viteConfigPath}"`, { stdio: 'inherit' })
  }

  // Log the successful completion of the build process
  console.log('Build completed successfully.')
} catch (error) {
  // Log the error message if the build process fails
  console.error('Build failed:', error.message)

  // Exit the process with a failure code
  process.exit(1)
}
