/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order', 'stylelint-config-standard-vue/scss'],
  plugins: ['stylelint-order'],
  rules: {
    'no-empty-source': null,
    'selector-class-pattern': null
  },
  ignoreFiles: ['packages/**/dist/*.css']
}
