import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const env = process.env.BUILD_ENV || 'production'

try {
  console.log(`Starting build for environment: ${env}`)
  console.log('Removing the dist directory...')

  fs.rmSync(path.resolve('.', 'dist'), { recursive: true, force: true })

  console.log('Compiling TypeScript...')
  execSync('tsc -b', { stdio: 'inherit' })

  const bundlePagesDir = path.resolve('.', 'src', 'bundlePages')

  if (!fs.existsSync(bundlePagesDir)) {
    throw new Error(`The bundlePages directory does not exist at: ${bundlePagesDir}`)
  }

  const directories = fs.readdirSync(bundlePagesDir).filter(file => {
    return fs.statSync(path.join(bundlePagesDir, file)).isDirectory()
  })

  for (const dir of directories) {
    const viteConfigPath = path.join(bundlePagesDir, dir, 'vite.config.ts')

    console.log(`Building bundle page: ${dir} with config: ${viteConfigPath}`)

    if (!fs.existsSync(viteConfigPath)) {
      throw new Error(`Vite configuration file does not exist at: ${viteConfigPath}`)
    }

    console.log(`Executing vite build with config: ${viteConfigPath} for mode: ${env}`)
    execSync(`vite build -c "${viteConfigPath}" --mode ${env}`, { stdio: 'inherit' })
  }

  console.log('Build completed successfully.')
} catch (error) {
  console.error('Build failed:', error.message)
  process.exit(1)
}
