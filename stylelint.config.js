module.exports = {
    extends: [
        'stylelint-config-standard-scss', // Extend standard SCSS rules
        'stylelint-prettier/recommended', // Integrate Prettier rules
    ],
    plugins: [
        'stylelint-scss', // SCSS-specific linting rules
        'stylelint-order', // Property order rules
    ],
    overrides: [
        {
            files: ['**/*.scss'], // Apply these settings to SCSS files
            customSyntax: 'postcss-scss', // Set PostCSS as the SCSS syntax parser
        },
        {
            files: ['**/*.{js,jsx,ts,tsx}'], // Apply this for JS files
            customSyntax: '@stylelint/postcss-css-in-js', // Use CSS-in-JS parser
        },
    ],
    rules: {
        'prettier/prettier': [
            true,
            {
                singleQuote: true,
                tabWidth: 4,
                bracketSpacing: true,
                endOfLine: 'auto',
            },
        ], // Ensure Prettier formatting
        'order/order': ['custom-properties', 'declarations'], // Ordering for CSS properties
        'order/properties-order': [
            [
                'position',
                'top',
                'right',
                'bottom',
                'left',
                'display',
                'width',
                'height',
                'color',
                'background',
            ],
            { unspecified: 'bottomAlphabetical' },
        ],
        'scss/at-rule-no-unknown': true, // Disallow unknown SCSS at-rules
        'block-no-empty': null, // Allow empty blocks
        'color-no-invalid-hex': true, // Disallow invalid hex color values
        'scss/load-no-partial-leading-underscore': null, // Disable this rule if it's not required
    },
    ignoreFiles: [
        '**/node_modules/**', // Ignore files in node_modules
        '**/dist/**', // Ignore built files
        '**/build/**', // Ignore build output
        '**/*.min.css', // Ignore minified CSS
        '**/ignored-folder/**', // Ignore a specific folder
        'custom.theme.scss', // Ignore a specific file
        'layout.css',
    ],
}
