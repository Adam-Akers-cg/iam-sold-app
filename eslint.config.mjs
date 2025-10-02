import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import cssModulesPlugin from 'eslint-plugin-css-modules'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    {
        ignores: ['.next/**', 'config/**', '**/temp.js', 'public/**'],
    },
    ...compat.extends('next/core-web-vitals'),
    {
        plugins: {
            'css-modules': cssModulesPlugin,
        },
        settings: {
            'css-modules': {
                basePath: 'src',
            },
        },
        rules: {
            'css-modules/no-unused-class': 'warn',
            'css-modules/no-undef-class': 'warn',
        },
    },
]

export default eslintConfig
